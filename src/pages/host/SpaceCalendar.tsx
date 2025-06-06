
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { LoadingState } from '@/components/host/LoadingState';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking } from '@/types/BookingTypes';
import { Space } from '@/types/SpaceTypes';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { HostLayout } from '@/components/layouts/HostLayout';

// Add global CSS styles for the booking indicator
const bookingIndicatorStyle = `
  .booking-indicator::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: currentColor;
  }
`;

const SpaceCalendar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [space, setSpace] = useState<Space | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add style element to head when component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = bookingIndicatorStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchSpaceAndBookings = async () => {
      setIsLoading(true);
      try {
        // Fetch space
        const { data: spaceData, error: spaceError } = await supabase
          .from('spaces')
          .select('*')
          .eq('id', id)
          .single() as { data: Space, error: any };
          
        if (spaceError) throw spaceError;
        
        // Verify ownership
        if (spaceData.host_id !== user.id) {
          toast.error('Você não tem permissão para visualizar este espaço');
          navigate('/host/spaces');
          return;
        }
        
        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('space_id', id)
          .order('booking_date', { ascending: true }) as { data: Booking[], error: any };
          
        if (bookingsError) throw bookingsError;
        
        setSpace(spaceData);
        setBookings(bookingsData || []);
        
        // Filter bookings for the selected date
        if (selectedDate) {
          filterBookingsByDate(selectedDate, bookingsData || []);
        }
        
      } catch (error: any) {
        console.error('Error fetching space data:', error);
        toast.error('Erro ao carregar dados do espaço e reservas');
        navigate('/host/spaces');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaceAndBookings();
  }, [id, user, navigate]);

  // Filter bookings when date changes
  useEffect(() => {
    if (selectedDate && bookings.length > 0) {
      filterBookingsByDate(selectedDate, bookings);
    } else {
      setSelectedDateBookings([]);
    }
  }, [selectedDate]);

  // Helper function to filter bookings by date
  const filterBookingsByDate = (date: Date, allBookings: Booking[]) => {
    const dateString = date.toISOString().split('T')[0];
    const filtered = allBookings.filter(booking => 
      booking.booking_date && booking.booking_date.startsWith(dateString)
    );
    setSelectedDateBookings(filtered);
  };

  // Helper function to check if a date has bookings
  const hasBookingsOnDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.some(booking => 
      booking.booking_date && booking.booking_date.startsWith(dateString)
    );
  };

  // Function to modify the day elements to show booking indicators
  const modifyDay = (date: Date) => {
    const hasEvents = hasBookingsOnDate(date);
    if (hasEvents) {
      return { className: 'relative booking-indicator' };
    }
    return {};
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="rounded-full mr-4" onClick={() => navigate('/host/spaces')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>Selecione uma data para ver as reservas</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md p-3 pointer-events-auto"
                modifiers={{
                  booked: (date) => hasBookingsOnDate(date),
                }}
                modifiersStyles={{
                  booked: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                Reservas para {selectedDate?.toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateBookings.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateBookings.map((booking) => (
                    <Card key={booking.id} className="border border-border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{booking.client_name}</CardTitle>
                          <Badge>{booking.status}</Badge>
                        </div>
                        <CardDescription>{booking.event_type || 'Evento'}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{booking.start_time} - {booking.end_time}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{booking.guest_count} convidados</span>
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="mt-2 text-sm">
                            <p className="text-muted-foreground">{booking.notes}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" asChild className="w-full">
                          <Link to={`/host/bookings/${booking.id}`}>Ver detalhes</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhuma reserva encontrada para esta data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpaceCalendar;
