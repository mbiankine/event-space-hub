
import React from 'react';
import { Card } from '@/components/ui/card';
import { MessagesThread } from '@/components/client/MessagesThread';
import BookingHeader from '@/components/client/booking/BookingHeader';
import BookingInfo from '@/components/client/booking/BookingInfo';
import PaymentDetails from '@/components/client/booking/PaymentDetails';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Booking } from '@/types/BookingTypes';

interface BookingContentProps {
  booking: Booking;
  onPayment: () => void;
  isPaymentLoading: boolean;
}

const BookingContent = ({ booking, onPayment, isPaymentLoading }: BookingContentProps) => {
  const isPaymentComplete = booking.payment_status === 'paid';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <BookingHeader 
            title={booking.space_title} 
            images={booking.images} 
          />
          <BookingInfo booking={booking} />
          <PaymentDetails booking={booking} />
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        {isPaymentComplete ? (
          <MessagesThread 
            contactId={booking.host_id}
            spaceId={booking.space_id}
            bookingId={booking.id}
          />
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="mb-4">As mensagens estarão disponíveis após o pagamento.</p>
              <Button onClick={onPayment} disabled={isPaymentLoading}>
                {isPaymentLoading ? 'Processando...' : 'Efetuar Pagamento'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingContent;
