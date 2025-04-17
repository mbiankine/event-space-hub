
import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SuccessStateProps {
  bookingId: string;
  spaceTitle?: string;
}

export const SuccessState = ({ bookingId, spaceTitle }: SuccessStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Pagamento confirmado!</h1>
      
      {spaceTitle && (
        <p className="text-lg text-muted-foreground mb-6">
          Sua reserva para <span className="font-medium block mt-1">{spaceTitle}</span> foi confirmada.
        </p>
      )}
      
      <p className="text-muted-foreground mb-8">
        Enviamos um comprovante para o seu e-mail. 
        Você pode ver os detalhes da sua reserva no seu painel.
      </p>
      
      <div className="space-y-4 w-full">
        <Button asChild className="w-full">
          <Link to={`/client/bookings/${bookingId}`}>
            Ver detalhes da reserva
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full">
          <Link to="/client/dashboard">
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};
