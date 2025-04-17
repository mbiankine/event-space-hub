
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface CredentialsFormProps {
  isLoading: boolean;
  isProduction: boolean;
  testApiKey: string;
  prodApiKey: string;
  webhookSecret: string;
  errorMessage: string;
  setTestApiKey: (value: string) => void;
  setProdApiKey: (value: string) => void;
  setWebhookSecret: (value: string) => void;
  handleSaveKeys: () => Promise<void>;
}

export function CredentialsForm({
  isLoading,
  isProduction,
  testApiKey,
  prodApiKey,
  webhookSecret,
  errorMessage,
  setTestApiKey,
  setProdApiKey,
  setWebhookSecret,
  handleSaveKeys
}: CredentialsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Credenciais do Stripe</CardTitle>
        <CardDescription>Configure suas chaves de API do Stripe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Chave Secreta de Teste</label>
          <Input 
            type="password"
            placeholder="sk_test_..." 
            value={testApiKey}
            onChange={(e) => setTestApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Chave secreta para ambiente de testes. Formato: sk_test_...
          </p>
        </div>
        
        {isProduction && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Chave Secreta de Produção</label>
            <Input 
              type="password"
              placeholder="sk_live_..." 
              value={prodApiKey}
              onChange={(e) => setProdApiKey(e.target.value)}
              className="border-amber-400"
            />
            <p className="text-xs text-amber-500">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              Cuidado! Esta é sua chave de produção para pagamentos reais.
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Webhook Secret (Opcional)</label>
          <Input 
            type="password"
            placeholder="whsec_..." 
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Secret para verificar webhooks do Stripe.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 p-2 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded">
            <div className="flex gap-2 items-start mb-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <p className="text-sm text-red-600">Erro ao validar as chaves do Stripe. Verifique se:</p>
            </div>
            <ul className="text-xs text-red-600 ml-6 list-disc space-y-1">
              <li>A chave de teste começa com <code>sk_test_</code> e é válida</li>
              <li>Você está logado como administrador</li>
              <li>A sessão de autenticação está válida (tente fazer login novamente)</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSaveKeys} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : "Salvar Credenciais"}
        </Button>
      </CardFooter>
    </Card>
  );
}
