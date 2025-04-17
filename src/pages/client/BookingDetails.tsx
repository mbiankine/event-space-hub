import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, User, CreditCard, MessageCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { MessagesThread } from '@/components/client/MessagesThread';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
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
        
        // If payment is paid but status is still pending, update to confirmed
        if (data.payment_status === 'paid' && data.status === 'pending') {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', data.id);
          
          if (updateError) {
            console.error('Error updating booking status:', updateError);
          } else {
            data.status = 'confirmed';
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
      }
    };
    
    fetchBookingDetails();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('booking-updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'bookings',
          filter: `id=eq.${id}` 
        }, 
        () => {
          fetchBookingDetails();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);
  
  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
  };
  
  // Format currency function
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const getAddress = (location: any) => {
    if (!location) return 'Endereço indisponível';
    
    if (typeof location === 'string') {
      try {
        location = JSON.parse(location);
      } catch (e) {
        return 'Endereço indisponível';
      }
    }
    
    if (location.address) return location.address;
    if (location.street) {
      return `${location.street}${location.number ? ', ' + location.number : ''}${location.city && location.state ? ' - ' + location.city + ', ' + location.state : ''}`;
    }
    
    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    }
    
    return 'Endereço indisponível';
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pago</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
    }
  };
  
  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Confirmado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
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
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Erro</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link to="/client/dashboard">Voltar para o Dashboard</Link>
            </Button>
          </div>
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-6">
          <Link to="/client/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Detalhes da Reserva</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={booking.images && booking.images.length > 0 
                    ? booking.images[0] 
                    : 'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop'}
                  alt={booking.space_title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{booking.space_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.description && (
                    <p className="text-muted-foreground">{booking.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      {(booking.start_time && booking.end_time) && (
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>{booking.start_time} - {booking.end_time}</span>
                        </div>
                      )}
                      {booking.guest_count && (
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>{booking.guest_count} convidados</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{getAddress(booking.location)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Anfitrião: {booking.host_name || 'Anfitrião'}</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="inline-flex items-center">
                          Pagamento: {getPaymentStatusBadge(booking.payment_status)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="inline-flex items-center">
                          Status: {getBookingStatusBadge(booking.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Detalhes do Pagamento</h3>
                    <div className="flex justify-between">
                      <span>Valor do espaço</span>
                      <span>{booking.space_price ? formatCurrency(booking.space_price) : '-'}</span>
                    </div>
                    {booking.additional_services_price > 0 && (
                      <div className="flex justify-between">
                        <span>Serviços adicionais</span>
                        <span>{formatCurrency(booking.additional_services_price)}</span>
                      </div>
                    )}
                    {booking.service_fee > 0 && (
                      <div className="flex justify-between">
                        <span>Taxa de serviço</span>
                        <span>{formatCurrency(booking.service_fee)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{booking.total_price ? formatCurrency(booking.total_price) : '-'}</span>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-medium mb-2">Observações</h3>
                        <p className="text-muted-foreground">{booking.notes}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            {booking.payment_status === 'paid' ? (
              <MessagesThread 
                contactId={booking.host_id}
                spaceId={booking.space_id}
                bookingId={booking.id}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Mensagens</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="mb-4">As mensagens estarão disponíveis após o pagamento.</p>
                  <Button>Efetuar Pagamento</Button>
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
