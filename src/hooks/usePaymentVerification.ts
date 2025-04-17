
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
          console.log("Found existing booking with this payment intent:", existingBooking);
          
          // If payment status isn't already marked as paid, update it
          if (existingBooking.payment_status !== 'paid') {
            const { error: updateError } = await supabase
              .from('bookings')
              .update({ 
                payment_status: 'paid',
                status: 'confirmed',
                payment_method: existingBooking.payment_method || 'card',
                updated_at: new Date().toISOString()
              })
              .eq('id', existingBooking.id);
              
            if (updateError) {
              console.error("Error updating booking status:", updateError);
            } else {
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
        
        if (!user) {
          console.error("No authenticated user found");
          throw new Error("User authentication required");
        }
        
        // Look for the most recent pending booking for this user
        const { data: pendingBookings, error: pendingError } = await supabase
          .from('bookings')
          .select('id, status, space_title, payment_intent, client_id, payment_status')
          .eq('payment_status', 'pending')
          .eq('client_id', user.id)
          .is('payment_intent', null)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (pendingError) {
          console.error("Error looking up pending bookings:", pendingError);
          throw pendingError;
        }
        
        if (pendingBookings && pendingBookings.length > 0) {
          console.log("Found recent pending booking:", pendingBookings[0]);
          const booking = pendingBookings[0];
          
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
              payment_intent: sessionId,
              payment_method: 'card',
              updated_at: new Date().toISOString()
            })
            .eq('id', booking.id);
          
          if (updateError) {
            console.error("Error updating booking:", updateError);
            throw updateError;
          }
          
          console.log("Successfully updated booking with payment information");
          
          // Verify the update was successful
          const { data: verifiedBooking, error: verifyError } = await supabase
            .from('bookings')
            .select('id, status, space_title, payment_method, payment_status')
            .eq('id', booking.id)
            .single();
            
          if (verifyError) {
            console.error("Error verifying booking update:", verifyError);
          } else {
            console.log("Verified booking update:", verifiedBooking);
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
    
    // Also set up a real-time subscription to catch webhook updates
    if (sessionId) {
      const channel = supabase
        .channel('booking-payment-updates')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `payment_intent=eq.${sessionId}`
        }, (payload) => {
          console.log('Booking payment updated via webhook:', payload);
          if (payload.new && payload.new.payment_status === 'paid') {
            setBookingDetails({
              id: payload.new.id,
              status: payload.new.status,
              space_title: payload.new.space_title,
              payment_method: payload.new.payment_method || 'card'
            });
            toast.success('Pagamento confirmado com sucesso!');
          }
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [sessionId]);

  return { isLoading, bookingDetails };
}
