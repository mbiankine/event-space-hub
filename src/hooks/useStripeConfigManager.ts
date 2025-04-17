
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StripeConfig {
  id: string;
  test_key: string;
  prod_key: string | null;
  webhook_secret: string | null;
  mode: 'test' | 'production';
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export function useStripeConfigManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isProduction, setIsProduction] = useState(false);
  const [testApiKey, setTestApiKey] = useState("");
  const [prodApiKey, setProdApiKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [stripeConnected, setStripeConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");

  // Fetch existing configuration from database
  useEffect(() => {
    fetchStripeConfig();
  }, []);

  const fetchStripeConfig = async () => {
    try {
      setIsLoadingConfig(true);
      const { data, error } = await supabase
        .from('stripe_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching Stripe config:", error);
        return;
      }
      
      if (data) {
        setTestApiKey(data.test_key || '');
        setProdApiKey(data.prod_key || '');
        setWebhookSecret(data.webhook_secret || '');
        setIsProduction(data.mode === 'production');
        setStripeConnected(true);
        
        toast.success("Configuração do Stripe carregada com sucesso", { id: "stripe-config-loaded" });
      }
    } catch (error: any) {
      console.error("Error in fetchStripeConfig:", error);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    // Reset error when changing API keys
    if (testApiKey || prodApiKey) {
      setErrorMessage("");
      setErrorDetails("");
    }
  }, [testApiKey, prodApiKey]);

  const handleSaveKeys = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setErrorDetails("");
      
      // Validate input
      if (!testApiKey || testApiKey.trim() === "") {
        throw new Error("Chave de API de teste é obrigatória");
      }
      
      if (isProduction && (!prodApiKey || prodApiKey.trim() === "")) {
        throw new Error("Chave de API de produção é obrigatória no modo de produção");
      }
      
      // Basic format validation
      if (!testApiKey.startsWith('sk_test_')) {
        throw new Error("A chave de API de teste deve começar com 'sk_test_'");
      }
      
      if (isProduction && !prodApiKey.startsWith('sk_live_')) {
        throw new Error("A chave de API de produção deve começar com 'sk_live_'");
      }

      // Save keys via edge function
      const { data, error } = await supabase.functions.invoke('save-stripe-keys', {
        body: { 
          testApiKey: testApiKey.trim(), 
          prodApiKey: isProduction ? prodApiKey.trim() : null,
          mode: isProduction ? 'production' : 'test',
          webhookSecret: webhookSecret.trim() || null
        }
      });
      
      if (error) {
        console.error("Function error:", error);
        setErrorMessage(`Erro na função: ${error.message}`);
        setErrorDetails(JSON.stringify(error, null, 2));
        throw new Error(`Erro na função: ${error.message}`);
      }
      
      if (data?.error) {
        console.error("API error:", data.error, data.details);
        setErrorMessage(`Erro: ${data.error}`);
        setErrorDetails(data.details || "Sem detalhes adicionais");
        throw new Error(`Erro: ${data.error}`);
      }
      
      setStripeConnected(true);
      toast.success("Configurações do Stripe salvas com sucesso!");
    } catch (error: any) {
      console.error("Error saving Stripe keys:", error);
      setStripeConnected(false);
      
      if (!errorMessage) {
        setErrorMessage(error.message || "Erro ao salvar configurações do Stripe");
      }
      
      toast.error(error.message || "Erro ao salvar configurações do Stripe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = (value: boolean) => {
    setIsProduction(value);
  };

  // Helper function to mask API keys for display
  const maskKey = (key: string | null) => key 
    ? `${key.substring(0, 7)}${'•'.repeat(key.length - 11)}${key.substring(key.length - 4)}` 
    : '';

  return {
    isLoading,
    isLoadingConfig,
    isProduction,
    testApiKey,
    prodApiKey,
    webhookSecret,
    stripeConnected,
    errorMessage,
    errorDetails,
    setTestApiKey,
    setProdApiKey,
    setWebhookSecret,
    handleSaveKeys,
    handleToggleMode,
    maskKey
  };
}
