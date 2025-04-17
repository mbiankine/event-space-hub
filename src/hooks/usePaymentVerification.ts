
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BookingDetails {
  id: string;
  status: string;
  space_title?: string;
  payment_method?: string;
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
        
        // First, check if we already have a booking with this payment_intent
        const { data: existingBooking, error: existingError } = await supabase
          .from('bookings')
          .select('id, status, space_title, client_id, payment_status, payment_method')
          .eq('payment_intent', sessionId)
          .maybeSingle();
        
        if (existingError) {
          console.error("Error checking existing booking:", existingError);
          throw existingError;
        }
        
        // If we found an existing booking, return it
        if (existingBooking) {
          console.log("Found existing booking with this payment intent:", existingBooking.id);
          
          // If payment status isn't already marked as paid, update it
          if (existingBooking.payment_status !== 'paid') {
            const { error: updateError } = await supabase
              .from('bookings')
              .update({ 
                payment_status: 'paid',
                status: 'confirmed',
                updated_at: new Date().toISOString()
              })
              .eq('id', existingBooking.id);
              
            if (updateError) {
              console.error("Error updating booking status:", updateError);
            } else {
              existingBooking.status = 'confirmed';
              existingBooking.payment_status = 'paid';
              console.log("Updated booking payment status to paid");
            }
          }
          
          setBookingDetails({
            id: existingBooking.id,
            status: existingBooking.status,
            space_title: existingBooking.space_title,
            payment_method: existingBooking.payment_method || 'card'
          });
          return;
        }
        
        console.log("Looking for recent pending bookings");
        
        // Get the current user to make sure we link the booking to the right client
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error getting current user:", userError);
          throw userError;
        }
        
        // Look for the most recent pending booking for this user
        const { data: pendingBookings, error: pendingError } = await supabase
          .from('bookings')
          .select('id, status, space_title, payment_intent, client_id')
          .eq('payment_status', 'pending')
          .eq('client_id', user?.id)
          .is('payment_intent', null)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (pendingError) {
          console.error("Error looking up pending bookings:", pendingError);
          throw pendingError;
        }
        
        if (pendingBookings && pendingBookings.length > 0) {
          console.log("Found recent pending booking:", pendingBookings[0].id);
          const booking = pendingBookings[0];
          
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed', // Always set status to confirmed when payment is successful
              payment_intent: sessionId,
              payment_method: 'card',
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
            space_title: booking.space_title,
            payment_method: 'card'
          });
          
          toast.success('Pagamento confirmado com sucesso!');
        } else {
          console.log("No related booking found, showing generic confirmation");
          setBookingDetails({
            id: sessionId.substring(0, 8),
            status: 'confirmed',
            payment_method: 'card' // Default value
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
