
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Booking } from "@/types/BookingTypes";

interface BookingsListProps {
  bookings: Booking[];
}

export const BookingsList = ({ bookings }: BookingsListProps) => {
  if (bookings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CardContent className="pt-6 pb-4">
          <h3 className="text-xl font-medium mb-2">Sem reservas recentes</h3>
          <p className="text-muted-foreground mb-4">
            Quando você receber reservas para seus espaços, elas aparecerão aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format date function to replace date-fns
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{booking.space_title || "Espaço Reservado"}</CardTitle>
                <CardDescription>{booking.event_type || "Evento"}</CardDescription>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {booking.total_price?.toFixed(2) || "0,00"}</p>
                <p className="text-sm text-muted-foreground">Cliente: {booking.client_name || "Cliente"}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {booking.booking_date ? 
                    formatDate(booking.booking_date) : 
                    "Data não definida"}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{booking.start_time || "--:--"} - {booking.end_time || "--:--"}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{booking.guest_count || 0} convidados</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link to={`/host/bookings/${booking.id}/messages`}>Mensagem</Link>
            </Button>
            <Button asChild>
              <Link to={`/host/bookings/${booking.id}`}>Detalhes</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
