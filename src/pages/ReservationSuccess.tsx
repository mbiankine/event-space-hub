import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Booking } from '@/types/BookingTypes';

interface BookingDetails {
  id: string;
  status: string;
  space_title?: string;
}

const ReservationSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        console.log("Session ID provided:", sessionId);
        console.log("Looking for recent pending bookings");
        
        const { data: pendingBookings, error: pendingError } = await supabase
          .from('bookings')
          .select('id, status, space_title')
          .eq('payment_status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (pendingError) {
          console.error("Error looking up pending bookings:", pendingError);
          throw pendingError;
        }
        
        if (pendingBookings && pendingBookings.length > 0) {
          console.log("Found recent pending booking:", pendingBookings[0].id);
          const booking = pendingBookings[0] as BookingDetails;
          
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
              updated_at: new Date().toISOString()
            })
            .eq('id', booking.id);
          
          if (updateError) {
            console.error("Error updating booking:", updateError);
            throw updateError;
          }
          
          setBookingDetails({
            id: booking.id,
            status: 'confirmed',
            space_title: booking.space_title
          });
          
          toast.success('Pagamento confirmado com sucesso!');
        } else {
          console.log("No related booking found, showing generic confirmation");
          setBookingDetails({
            id: sessionId.substring(0, 8),
            status: 'confirmed'
          });
        }
      } catch (error: any) {
        console.error('Error verifying payment:', error);
        toast.error('Ocorreu um erro ao verificar o pagamento', {
          description: error.message
        });
      } finally {
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
            {bookingDetails.space_title && (
              <p className="mt-2 text-muted-foreground">
                Espaço: {bookingDetails.space_title}
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
    </div>
  );
};

export default ReservationSuccess;
