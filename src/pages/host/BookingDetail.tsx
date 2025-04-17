
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Booking } from "@/types/BookingTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookingDetailHeader from "@/components/host/booking/BookingDetailHeader";
import BookingDetailActions from "@/components/host/booking/BookingDetailActions";
import BookingDetailContent from "@/components/host/booking/BookingDetailContent";

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

        // Create a properly typed booking object with optional payment_method
        const tempBooking: Booking = {
          ...bookingData,
          // Add payment_method if needed - it's optional in the Booking type
          payment_method: bookingData.payment_method || 'card'
        };

        setBooking(tempBooking);

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
            <CardContent>
              <p className="text-center text-muted-foreground">Reserva não encontrada ou você não tem permissão para visualizá-la.</p>
              <div className="mt-4 flex justify-center">
                <Button asChild>
                  <Link to="/host/bookings">Voltar para reservas</Link>
                </Button>
              </div>
            </CardContent>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <BookingDetailHeader booking={booking} />
          {booking && (
            <BookingDetailActions
              booking={booking}
              user={user}
              onStatusUpdate={(newStatus) => setBooking(booking ? { ...booking, status: newStatus } : null)}
            />
          )}
        </div>
        <BookingDetailContent 
          booking={booking} 
          client={client} 
          space={space} 
          formatDate={formatDate}
        />
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetail;
