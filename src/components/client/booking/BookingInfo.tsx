
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BookingInfoProps {
  booking: {
    booking_date: string;
    start_time?: string | null;
    end_time?: string | null;
    guest_count?: number | null;
    location?: any;
    host_name?: string;
    notes?: string | null;
  };
}

const BookingInfo = ({ booking }: BookingInfoProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
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

  return (
    <CardContent>
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
    </CardContent>
  );
};

export default BookingInfo;
