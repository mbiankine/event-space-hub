
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SuccessStateProps {
  bookingId: string;
  spaceTitle?: string;
}

export function SuccessState({ bookingId, spaceTitle }: SuccessStateProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center">
          <CheckCircle className="h-24 w-24 text-green-500 mb-4" />
          <CardTitle className="text-2xl text-center">Reserva Confirmada!</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="mb-4">
            Sua reserva foi processada com sucesso. Enviamos um e-mail de confirmação com todos os detalhes.
          </p>
          <p className="font-medium">
            Código da reserva: {bookingId}
          </p>
          {spaceTitle && (
            <p className="mt-2 text-muted-foreground">
              Espaço: {spaceTitle}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/">Voltar ao Início</Link>
        </Button>
        <Button asChild>
          <Link to="/client/dashboard">Minhas Reservas</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
