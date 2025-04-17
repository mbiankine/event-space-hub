
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function ErrorState() {
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Ocorreu um erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Não foi possível verificar os detalhes da sua reserva. Por favor, entre em contato com o suporte.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
