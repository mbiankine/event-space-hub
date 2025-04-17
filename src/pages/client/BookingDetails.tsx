
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useStripeConfig } from '@/hooks/useStripeConfig';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useBookingDetails } from '@/hooks/useBookingDetails';
import BookingLayout from '@/components/client/booking/BookingLayout';
import BookingContent from '@/components/client/booking/BookingContent';
import BookingNotFound from '@/components/client/booking/BookingNotFound';
import { toast } from 'sonner';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { startStripeCheckout, isLoading: isPaymentLoading } = useStripeConfig();
  const { booking, isLoading, error, isRefreshing, handleRefresh } = useBookingDetails(id, user);
  
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
  
  if (isLoading) {
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
