
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

export interface ClientBooking {
  id: string;
  space_id: string;
  space_title: string;
  booking_date: string;
  start_time: string | null;
  end_time: string | null;
  guest_count: number | null;
  total_price: number | null;
  payment_status: string | null;
  status: string | null;
  location: any;
  host_id: string;
  images?: string[];
}

interface ClientBookingsListProps {
  bookings: ClientBooking[];
  type: 'current' | 'past';
}

export const ClientBookingsList = ({ bookings, type }: ClientBookingsListProps) => {
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

  if (bookings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CardContent className="pt-6 pb-4">
          <h3 className="text-xl font-medium mb-2">
            {type === 'current' ? 'Sem reservas atuais' : 'Sem histórico de reservas'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {type === 'current' 
              ? 'Você ainda não possui reservas ativas.'
              : 'Você ainda não possui reservas anteriores.'}
          </p>
          <Button asChild>
            <Link to="/">Procurar espaços</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={booking.images && booking.images.length > 0 
                ? booking.images[0] 
                : 'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop'}
              alt={booking.space_title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader className="pb-2">
            <CardTitle>{booking.space_title}</CardTitle>
            <CardDescription>
              {booking.location && booking.location.city && booking.location.state 
                ? `${booking.location.city}, ${booking.location.state}` 
                : 'Localização não disponível'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formatDate(booking.booking_date)}</span>
              </div>
              {(booking.start_time && booking.end_time) && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.start_time} - {booking.end_time}</span>
                </div>
              )}
              {booking.guest_count && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.guest_count} convidados</span>
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {booking.location && booking.location.address 
                    ? booking.location.address 
                    : 'Endereço não disponível'}
                </span>
              </div>
              {booking.total_price && (
                <div className="mt-2 font-medium">
                  Total: {formatCurrency(booking.total_price)}
                </div>
              )}
              {booking.payment_status && (
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    booking.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={`/client/bookings/${booking.id}`}>Detalhes</Link>
            </Button>
            {type === 'current' && booking.payment_status === 'paid' && (
              <Button asChild>
                <Link to={`/client/messages/${booking.host_id}?space_id=${booking.space_id}&booking_id=${booking.id}`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Mensagem
                </Link>
              </Button>
            )}
            {type === 'past' && (
              <Button variant="outline">Avaliar</Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
