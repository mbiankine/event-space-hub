
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HostLayout } from '@/components/layouts/HostLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/host/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Check, X, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Booking } from '@/types/BookingTypes';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeStatus, setActiveStatus] = useState<string>("upcoming");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('host_id', user.id)
          .order('booking_date', { ascending: true }) as { data: Booking[], error: any };
          
        if (error) throw error;
        
        setBookings(data || []);
        filterBookings(data || [], activeStatus, selectedDate);
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        toast.error('Erro ao carregar reservas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);

  // Filter bookings based on status and date
  const filterBookings = (allBookings: Booking[], status: string, date?: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = [...allBookings];
    
    // Filter by date if selected
    if (date) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        return bookingDate.toDateString() === date.toDateString();
      });
    }
    
    // Filter by status
    switch (status) {
      case "upcoming":
        filtered = filtered.filter(booking => {
          const bookingDate = new Date(booking.booking_date);
          return bookingDate >= today && booking.status !== 'cancelled';
        });
        break;
      case "past":
        filtered = filtered.filter(booking => {
          const bookingDate = new Date(booking.booking_date);
          return bookingDate < today && booking.status !== 'cancelled';
        });
        break;
      case "cancelled":
        filtered = filtered.filter(booking => booking.status === 'cancelled');
        break;
      default:
        // All bookings, no additional filtering
        break;
    }
    
    setFilteredBookings(filtered);
  };

  const handleTabChange = (value: string) => {
    setActiveStatus(value);
    filterBookings(bookings, value, selectedDate);
  };

  const handleDateChange = (date?: Date) => {
    setSelectedDate(date);
    if (date) {
      filterBookings(bookings, activeStatus, date);
    } else {
      filterBookings(bookings, activeStatus);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmada</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Concluída</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // For demo purposes, we'll generate some fake dates with bookings
  const getBookingDates = () => {
    const dates: Date[] = [];
    if (!bookings.length) return dates;
    
    bookings.forEach(booking => {
      dates.push(new Date(booking.booking_date));
    });
    
    return dates;
  };

  return (
    <HostLayout
      title="Reservas"
      description="Gerencie todas as reservas dos seus espaços"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              className="border rounded-md"
              locale={ptBR}
              modifiers={{
                booked: getBookingDates(),
              }}
              modifiersClassNames={{
                booked: "bg-primary/20 font-bold text-primary",
              }}
            />
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedDate(undefined)}
              >
                Limpar seleção
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Suas Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" onValueChange={handleTabChange}>
              <div className="mb-4">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                  <TabsTrigger value="past">Passadas</TabsTrigger>
                  <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                </TabsList>
              </div>
              
              {isLoading ? (
                <LoadingState />
              ) : (
                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="space-y-1">
                            <h4 className="font-medium">{booking.space_title || "Espaço não especificado"}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>Localização</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="text-sm">{format(new Date(booking.booking_date), 'dd MMM yyyy', {locale: ptBR})}</span>
                            </div>
                            
                            {booking.start_time && booking.end_time && (
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span className="text-sm">
                                  {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                                </span>
                              </div>
                            )}
                            
                            {booking.guest_count && (
                              <div className="flex items-center">
                                <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span className="text-sm">{booking.guest_count} convidados</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="font-medium">{booking.client_name || "Cliente"}</div>
                            <div className="text-sm text-muted-foreground">{booking.client_email || "Email não informado"}</div>
                            <div className="text-sm text-muted-foreground">{booking.client_phone || "Telefone não informado"}</div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              {getStatusBadge(booking.status || 'pending')}
                            </div>
                            <Button asChild size="sm">
                              <Link to={`/host/bookings/${booking.id}`}>
                                Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="text-lg font-medium">Nenhuma reserva encontrada</h3>
                      <p className="text-muted-foreground">
                        {selectedDate 
                          ? `Não há reservas para ${format(selectedDate, 'dd/MM/yyyy')}`
                          : "Você ainda não possui reservas nesta categoria"
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </HostLayout>
  );
};

export default BookingsPage;
