
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { MessagesThread } from '@/components/client/MessagesThread';
import BookingHeader from '@/components/client/booking/BookingHeader';
import BookingInfo from '@/components/client/booking/BookingInfo';
import PaymentDetails from '@/components/client/booking/PaymentDetails';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useStripeConfig } from '@/hooks/useStripeConfig';
import { toast } from 'sonner';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { startStripeCheckout, isLoading: isPaymentLoading } = useStripeConfig();
  
  const fetchBookingDetails = async () => {
    if (!id || !user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          spaces (
            title,
            images,
            description,
            location,
            capacity,
            host_id
          )
        `)
        .eq('id', id)
        .eq('client_id', user.id)
        .single();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error('Reserva não encontrada');
      }
      
      console.log("Booking details fetched:", data);
      
      // If payment is marked as paid but status is still pending, update status to confirmed
      if (data.payment_status === 'paid' && data.status === 'pending') {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', data.id);
        
        if (updateError) {
          console.error('Error updating booking status:', updateError);
        } else {
          data.status = 'confirmed';
          console.log("Updated booking status to confirmed");
        }
      }
      
      setBooking({
        ...data,
        space_title: data.spaces?.title || data.space_title,
        images: data.spaces?.images,
        description: data.spaces?.description,
        location: data.spaces?.location,
        capacity: data.spaces?.capacity,
        host_id: data.spaces?.host_id || data.host_id
      });
      
    } catch (error: any) {
      console.error('Error fetching booking details:', error);
      setError(error.message || 'Erro ao carregar detalhes da reserva');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookingDetails();
    toast.info('Atualizando informações da reserva...');
  };
  
  // Function to handle payment for pending bookings
  const handlePayment = async () => {
    if (!booking) return;
    
    try {
      let price = booking.total_price;
      const days = 1; // Default to 1 day if not specified
      
      await startStripeCheckout(booking.space_id, price, days, booking.id);
    } catch (error: any) {
      console.error('Payment error:', error);
    }
  };
  
  useEffect(() => {
    fetchBookingDetails();
    
    // Set up a real-time subscription to get updates to this booking
    const channel = supabase
      .channel('booking-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${id}`
      }, (payload) => {
        console.log('Booking updated:', payload);
        // Refresh booking data when updates occur
        fetchBookingDetails();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-8">
          <LoadingState 
            title="Carregando reserva"
            description="Por favor, aguarde enquanto carregamos os detalhes da sua reserva."
          />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-8">
          <ErrorState 
            title="Erro ao carregar reserva"
            description={error}
          />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Reserva não encontrada</h2>
            <p className="text-muted-foreground mb-4">A reserva solicitada não foi encontrada.</p>
            <Button asChild>
              <Link to="/client/dashboard">Voltar para o Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Check if payment is actually completed based on payment_status
  const isPaymentComplete = booking.payment_status === 'paid';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/client/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Detalhes da Reserva</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <BookingHeader 
                title={booking.space_title} 
                images={booking.images} 
              />
              <BookingInfo booking={booking} />
              <PaymentDetails booking={booking} />
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            {isPaymentComplete ? (
              <MessagesThread 
                contactId={booking.host_id}
                spaceId={booking.space_id}
                bookingId={booking.id}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="mb-4">As mensagens estarão disponíveis após o pagamento.</p>
                  <Button onClick={handlePayment} disabled={isPaymentLoading}>
                    {isPaymentLoading ? 'Processando...' : 'Efetuar Pagamento'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetails;
