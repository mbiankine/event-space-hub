
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

interface ConnectionStatusCardProps {
  isLoading: boolean;
  isLoadingConfig: boolean;
  stripeConnected: boolean;
  isProduction: boolean;
  handleToggleMode: (value: boolean) => void;
  handleSaveKeys: () => Promise<void>;
}

export function ConnectionStatusCard({
  isLoading,
  isLoadingConfig,
  stripeConnected,
  isProduction,
  handleToggleMode,
  handleSaveKeys
}: ConnectionStatusCardProps) {
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-muted">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Status da Conexão</CardTitle>
          <div className="rounded-full bg-white dark:bg-slate-800 p-1.5 shadow">
            <svg width="28" height="28" viewBox="0 0 40 40">
              <path fill="#635bff" d="M20,40 C8.954305,40 0,31.045695 0,20 C0,8.954305 8.954305,0 20,0 C31.045695,0 40,8.954305 40,20 C40,31.045695 31.045695,40 20,40 Z" />
              <path fill="#fff" d="M22.2771516,14.2768712 C22.2771516,13.1505497 23.1505497,12.2771516 24.2768712,12.2771516 C25.4031928,12.2771516 26.2765909,13.1505497 26.2765909,14.2768712 C26.2765909,15.4031928 25.4031928,16.2765909 24.2768712,16.2765909 C23.1505497,16.2765909 22.2771516,15.4031928 22.2771516,14.2768712 Z M16.3309826,14.6808504 L15.6710361,17.5876614 L17.6560751,17.5876614 L18.3160216,14.6808504 L16.3309826,14.6808504 Z M13.501556,14.6808504 L12.8416094,17.5876614 L14.8266484,17.5876614 L15.486595,14.6808504 L13.501556,14.6808504 Z M10.6721293,14.6808504 L10.0121828,17.5876614 L12.0021153,17.5876614 L12.6571683,14.6808504 L10.6721293,14.6808504 Z M15.2686734,20.1452151 L14.6137269,22.9968724 L16.5987658,22.9968724 L17.2537124,20.1452151 L15.2686734,20.1452151 Z M12.4392468,20.1452151 L11.7843002,22.9968724 L13.7742327,22.9968724 L14.4242857,20.1452151 L12.4392468,20.1452151 Z M9.6098201,20.1452151 L8.95487362,22.9968724 L10.9399125,22.9968724 L11.5948591,20.1452151 L9.6098201,20.1452151 Z M7.79906914,26.0180643 L9.78410815,26.0180643 L10.4390547,23.1664071 L8.4540157,23.1664071 L7.79906914,26.0180643 Z M22.4391649,23.1613007 L21.7842184,26.0129579 L23.7692574,26.0129579 L24.424204,23.1613007 L22.4391649,23.1613007 Z M19.6097382,23.1613007 L18.9547917,26.0129579 L20.9398307,26.0129579 L21.5947772,23.1613007 L19.6097382,23.1613007 Z M16.7803116,23.1613007 L16.125365,26.0129579 L18.110404,26.0129579 L18.7653506,23.1613007 L16.7803116,23.1613007 Z M13.9508849,23.1613007 L13.2959384,26.0129579 L15.2809773,26.0129579 L15.9359239,23.1613007 L13.9508849,23.1613007 Z M11.1214583,23.1613007 L10.4665117,26.0129579 L12.4515506,26.0129579 L13.1064972,23.1613007 L11.1214583,23.1613007 Z M23.8057477,17.5825551 L23.1508012,20.4393596 L25.1358402,20.4393596 L25.7907867,17.5825551 L23.8057477,17.5825551 Z M21.0315032,17.5825551 L20.3714501,20.4393596 L22.3564891,20.4393596 L23.0114356,17.5825551 L21.0315032,17.5825551 Z M18.1969701,17.5825551 L17.5420236,20.4393596 L19.5270625,20.4393596 L20.1820091,17.5825551 L18.1969701,17.5825551 Z M24.1007971,14.7613852 L23.445485,17.5825551 L25.4305239,17.5825551 L26.085836,14.7613852 L24.1007971,14.7613852 Z" />
            </svg>
          </div>
        </div>
        <CardDescription>Status atual da conexão com a API Stripe</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoadingConfig ? (
          <div className="flex items-center space-x-2 mb-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-medium">Carregando configuração...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 mb-4">
            {stripeConnected ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">Conectado e funcionando</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Não configurado</span>
              </>
            )}
          </div>
        )}
        
        <p className="text-muted-foreground mb-6 text-sm">
          A integração com o Stripe permite que sua plataforma processe pagamentos de forma segura 
          para reservas de espaços.
        </p>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">API Key:</span>
            <span>••••••••••••••••{stripeConnected ? '3k5j' : '----'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Modo:</span>
            <span>{isProduction ? 'Produção' : 'Teste'}</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h4 className="text-sm font-semibold">Modo Produção</h4>
              <p className="text-xs text-muted-foreground">Ativar modo de produção para pagamentos reais</p>
            </div>
            <Switch 
              checked={isProduction} 
              onCheckedChange={handleToggleMode}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={handleSaveKeys}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : "Salvar Configurações"}
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          disabled={!stripeConnected}
          onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Acessar Dashboard Stripe
        </Button>
      </CardFooter>
    </Card>
  );
}
