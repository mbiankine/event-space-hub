
import { CalendarIcon, Clock, Users, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingMainInfoProps {
  booking: {
    booking_date: string;
    start_time: string;
    end_time: string;
    guest_count: number;
    total_price: number;
    status: string;
    event_type?: string;
    notes?: string;
  };
  formatDate: (date: string) => string;
}

const BookingMainInfo = ({ booking, formatDate }: BookingMainInfoProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Reserva</CardTitle>
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
          <div className={`px-3 py-1 rounded-md text-center ${getStatusClass(booking.status)}`}>
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
  );
};

export default BookingMainInfo;
