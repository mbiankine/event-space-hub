
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ReservationSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Aqui você poderia chamar uma função edge para verificar o status do pagamento
        // Por enquanto, vamos simular isso
        setIsLoading(false);
        setBookingDetails({
          id: sessionId.substring(0, 8),
          status: 'confirmed'
        });
        
        // Em um caso real, você atualizaria o status de pagamento no banco de dados
      } catch (error) {
        console.error('Error verifying payment:', error);
        setIsLoading(false);
      }
    };
    
    verifyPayment();
  }, [sessionId]);
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12">
        <Card className="text-center">
          <CardContent className="pt-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-24 w-24 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-8 w-64 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!sessionId || !bookingDetails) {
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
  
  return (
    <div className="container max-w-4xl mx-auto py-12">
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
              Código da reserva: {bookingDetails.id}
            </p>
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
    </div>
  );
};

export default ReservationSuccess;
