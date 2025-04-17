
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, MessageSquare, CalendarIcon, Clock, Users, Banknote } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Booking } from "@/types/BookingTypes";

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [space, setSpace] = useState<any | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id || !user) return;

      setIsLoading(true);
      try {
        // Fetch booking details
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .eq('host_id', user.id)
          .single();

        if (bookingError) {
          throw bookingError;
        }

        if (!bookingData) {
          toast.error('Reserva não encontrada');
          return;
        }

        setBooking(bookingData);

        // Fetch space details if space_id exists
        if (bookingData.space_id) {
          const { data: spaceData, error: spaceError } = await supabase
            .from('spaces')
            .select('*')
            .eq('id', bookingData.space_id)
            .single();

          if (spaceError) {
            console.error('Error fetching space:', spaceError);
          } else {
            setSpace(spaceData);
          }
        }

        // Fetch client details if client_id exists
        if (bookingData.client_id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', bookingData.client_id)
            .single();

          if (profileError) {
            console.error('Error fetching client profile:', profileError);
          } else {
            setClient(profileData);
          }
        }

      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Erro ao carregar detalhes da reserva');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, user]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!booking || !user) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id)
        .eq('host_id', user.id);

      if (error) throw error;

      setBooking({ ...booking, status: newStatus });
      toast.success(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'atualizada'} com sucesso`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Erro ao atualizar status da reserva');
    }
  };

  // Format date function to replace date-fns
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não definido";
    
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 md:col-span-2" />
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
        <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reserva não encontrada</CardTitle>
              <CardDescription>A reserva solicitada não existe ou você não tem permissão para acessá-la.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link to="/host/bookings">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Voltar para reservas
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Button variant="outline" size="sm" className="mb-4" asChild>
              <Link to="/host/bookings">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar para reservas
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">Detalhes da Reserva</h1>
            <p className="text-muted-foreground">{booking.space_title || "Espaço reservado"}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensagens
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Conversa com {booking.client_name || "Cliente"}</SheetTitle>
                  <SheetDescription>Envie mensagens sobre esta reserva</SheetDescription>
                </SheetHeader>
                <div className="h-full flex flex-col justify-center items-center">
                  <p className="text-muted-foreground">Sistema de mensagens em desenvolvimento.</p>
                </div>
              </SheetContent>
            </Sheet>

            {booking.status === 'pending' && (
              <Button variant="default" onClick={() => handleUpdateStatus('confirmed')}>
                Confirmar Reserva
              </Button>
            )}

            {booking.status === 'confirmed' && (
              <Button variant="default" onClick={() => handleUpdateStatus('completed')}>
                Marcar como Concluída
              </Button>
            )}

            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <Button variant="destructive" onClick={() => handleUpdateStatus('cancelled')}>
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Booking info card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Reserva</CardTitle>
              <CardDescription>Detalhes desta reserva</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(booking.booking_date)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="font-medium">{booking.start_time || "--:--"} - {booking.end_time || "--:--"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Convidados</p>
                  <p className="font-medium">{booking.guest_count || 0} pessoas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Banknote className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-medium">R$ {booking.total_price?.toFixed(2) || "0,00"}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className={`px-3 py-1 rounded-md text-center
                  ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'}`}
                >
                  {booking.status === 'confirmed' ? 'Confirmada' :
                    booking.status === 'pending' ? 'Pendente' :
                    booking.status === 'completed' ? 'Concluída' :
                    booking.status === 'cancelled' ? 'Cancelada' :
                    'Status desconhecido'}
                </div>
              </div>
              {booking.event_type && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Tipo de evento</p>
                  <p>{booking.event_type}</p>
                </div>
              )}
              {booking.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Observações</p>
                  <p>{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client and Space Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-lg font-semibold">{booking.client_name || "Nome do Cliente"}</p>
                {booking.client_email && <p className="text-muted-foreground">{booking.client_email}</p>}
                {booking.client_phone && <p className="text-muted-foreground">{booking.client_phone}</p>}
              </div>
              
              {client && client.bio && (
                <div className="mb-6 bg-muted/30 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground mb-1">Sobre o cliente</p>
                  <p>{client.bio}</p>
                </div>
              )}
            </CardContent>
            
            {space && (
              <>
                <CardHeader className="border-t pt-6">
                  <CardTitle>Informações do Espaço</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{space.title}</p>
                  <p className="text-muted-foreground line-clamp-2 mb-4">{space.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Capacidade</p>
                      <p className="font-medium">{space.capacity} pessoas</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="font-medium">{space.space_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-medium">R$ {space.price}</p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetail;
