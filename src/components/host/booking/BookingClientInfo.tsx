
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingClientInfoProps {
  client: {
    bio?: string | null;
  } | null;
  booking: {
    client_name: string;
    client_email: string;
    client_phone: string;
  };
}

const BookingClientInfo = ({ client, booking }: BookingClientInfoProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-lg font-semibold">{booking.client_name}</p>
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
    </>
  );
};

export default BookingClientInfo;
