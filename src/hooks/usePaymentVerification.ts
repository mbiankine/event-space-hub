
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BookingDetails {
  id: string;
  status: string;
  space_title?: string;
}

export function usePaymentVerification(sessionId: string | null) {
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
          .select('id, status, space_title, payment_intent')
          .eq('payment_status', 'pending')
          .is('payment_intent', null)
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
              payment_intent: sessionId,
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

  return { isLoading, bookingDetails };
}
