
import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useStripeConfig } from '@/hooks/useStripeConfig';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useBookingDetails } from '@/hooks/useBookingDetails';
import BookingLayout from '@/components/client/booking/BookingLayout';
import BookingContent from '@/components/client/booking/BookingContent';
import BookingNotFound from '@/components/client/booking/BookingNotFound';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startStripeCheckout, isLoading: isPaymentLoading } = useStripeConfig();
  
  // Process potential Stripe checkout session ID
  useEffect(() => {
    const processCheckoutSession = async () => {
      if (!id || !id.startsWith('cs_')) return;
      
      try {
        // If this is a Stripe checkout session ID, try to find the associated booking
        console.log('Received Stripe checkout session ID, looking for associated booking');
        const { data, error } = await supabase
          .from('bookings')
          .select('id')
          .eq('payment_intent', id)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        if (data?.id) {
          // Redirect to the actual booking page using the booking ID
          navigate(`/client/bookings/${data.id}`, { replace: true });
          toast.success('Pagamento processado com sucesso!');
          return;
        }
        
        // If no booking was found, show a message and redirect to dashboard
        toast.error('Não foi possível encontrar a reserva associada a este pagamento');
        setTimeout(() => navigate('/client/dashboard', { replace: true }), 2000);
      } catch (error) {
        console.error('Error processing checkout session:', error);
        toast.error('Erro ao processar informações de pagamento');
        setTimeout(() => navigate('/client/dashboard', { replace: true }), 2000);
      }
    };
    
    processCheckoutSession();
  }, [id, navigate]);

  // Regular booking ID handling
  const { booking, isLoading, error, isRefreshing, handleRefresh } = useBookingDetails(
    // Only use ID for hook if it's a valid UUID
    id && !id.startsWith('cs_') ? id : undefined, 
    user
  );
  
  const handlePayment = async () => {
    if (!booking) return;
    
    try {
      const price = booking.total_price;
      const days = 1; // Default to 1 day if not specified
      await startStripeCheckout(booking.space_id, price, days, booking.id);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento', {
        description: error.message || 'Tente novamente mais tarde'
      });
    }
  };
  
  // Show loading for both regular loading and Stripe checkout session processing
  if (isLoading || (id && id.startsWith('cs_'))) {
    return (
      <BookingLayout>
        <LoadingState 
          title="Carregando reserva"
          description="Por favor, aguarde enquanto carregamos os detalhes da sua reserva."
        />
      </BookingLayout>
    );
  }
  
  if (error) {
    return (
      <BookingLayout>
        <ErrorState 
          title="Erro ao carregar reserva"
          description={error}
        />
      </BookingLayout>
    );
  }
  
  if (!booking) {
    return (
      <BookingLayout>
        <BookingNotFound />
      </BookingLayout>
    );
  }
  
  return (
    <BookingLayout onRefresh={handleRefresh} isRefreshing={isRefreshing}>
      <BookingContent 
        booking={booking}
        onPayment={handlePayment}
        isPaymentLoading={isPaymentLoading}
      />
    </BookingLayout>
  );
};

export default BookingDetails;
