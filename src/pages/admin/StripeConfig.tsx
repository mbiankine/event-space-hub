
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ConnectionStatusCard } from "@/components/admin/stripe/ConnectionStatusCard";
import { CredentialsForm } from "@/components/admin/stripe/CredentialsForm";
import { ErrorDisplay } from "@/components/admin/stripe/ErrorDisplay";
import { useStripeConfigManager } from "@/hooks/useStripeConfigManager";

const StripeConfig = () => {
  const navigate = useNavigate();
  const { hasRole, isLoading: authLoading } = useAuth();
  const stripeConfig = useStripeConfigManager();

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!hasRole('admin')) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Configuração do Stripe</h1>
          <p className="text-muted-foreground">Gerencie a integração de pagamentos para a plataforma</p>
        </div>

        <ErrorDisplay 
          errorMessage={stripeConfig.errorMessage} 
          errorDetails={stripeConfig.errorDetails} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConnectionStatusCard
            isLoading={stripeConfig.isLoading}
            isLoadingConfig={stripeConfig.isLoadingConfig}
            stripeConnected={stripeConfig.stripeConnected}
            isProduction={stripeConfig.isProduction}
            handleToggleMode={stripeConfig.handleToggleMode}
            handleSaveKeys={stripeConfig.handleSaveKeys}
          />
          
          <CredentialsForm
            isLoading={stripeConfig.isLoading}
            isProduction={stripeConfig.isProduction}
            testApiKey={stripeConfig.testApiKey}
            prodApiKey={stripeConfig.prodApiKey}
            webhookSecret={stripeConfig.webhookSecret}
            errorMessage={stripeConfig.errorMessage}
            setTestApiKey={stripeConfig.setTestApiKey}
            setProdApiKey={stripeConfig.setProdApiKey}
            setWebhookSecret={stripeConfig.setWebhookSecret}
            handleSaveKeys={stripeConfig.handleSaveKeys}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StripeConfig;
