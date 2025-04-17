
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Card className="text-center">
        <CardContent className="pt-10 pb-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-medium mb-2">Verificando reserva...</h3>
            <p className="text-muted-foreground">Aguarde enquanto verificamos os detalhes do seu pagamento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
