
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Booking } from "@/types/BookingTypes";
import BookingMainInfo from "@/components/host/booking/BookingMainInfo";
import BookingStatusActions from "@/components/host/booking/BookingStatusActions";
import BookingClientInfo from "@/components/host/booking/BookingClientInfo";
import BookingSpaceInfo from "@/components/host/booking/BookingSpaceInfo";

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
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .eq('host_id', user.id)
          .single();

        if (bookingError) throw bookingError;

        if (!bookingData) {
          toast.error('Reserva não encontrada');
          return;
        }

        // Add payment_method with default value if it doesn't exist
        const bookingWithPaymentMethod = {
          ...bookingData,
          payment_method: bookingData.payment_method || 'card'
        } as Booking;

        setBooking(bookingWithPaymentMethod);

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

  const formatDate = (dateString: string) => {
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
          <Card className="w-full max-w-md p-6">
            <p className="text-center text-muted-foreground">Reserva não encontrada ou você não tem permissão para visualizá-la.</p>
            <div className="mt-4 flex justify-center">
              <Button asChild>
                <Link to="/host/bookings">Voltar para reservas</Link>
              </Button>
            </div>
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

            <BookingStatusActions 
              booking={booking} 
              user={user} 
              onStatusUpdate={(newStatus) => setBooking({ ...booking, status: newStatus })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BookingMainInfo booking={booking} formatDate={formatDate} />

          <Card className="md:col-span-2">
            <BookingClientInfo client={client} booking={booking} />
            <BookingSpaceInfo space={space} />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetail;
