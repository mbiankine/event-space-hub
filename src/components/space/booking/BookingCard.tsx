
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BookingTypeSelector } from './BookingTypeSelector';
import { BookingDateSelector } from './BookingDateSelector';
import { GuestCounter } from './GuestCounter';
import { DurationSelector } from './DurationSelector';
import { BookingPriceSummary } from './BookingPriceSummary';
import { BookingErrorDialog } from './BookingErrorDialog';
import { Space } from '@/types/SpaceTypes';

interface BookingCardProps {
  space: Space;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  selectedHours: number;
  setSelectedHours: (hours: number) => void;
  selectedDays: number;
  setSelectedDays: (days: number) => void;
  bookingType: "hourly" | "daily";
  setBookingType: (type: "hourly" | "daily") => void;
  isDateAvailable: (date: Date) => boolean;
  handleBookNow: () => Promise<{ success: boolean, bookingId?: string }>;
  unavailableDates: Date[];
}

export function BookingCard({
  space,
  date,
  setDate,
  guests,
  setGuests,
  selectedHours,
  setSelectedHours,
  selectedDays,
  setSelectedDays,
  bookingType,
  setBookingType,
  isDateAvailable,
  handleBookNow,
  unavailableDates
}: BookingCardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = React.useState(false);

  const handleReserveClick = async () => {
    if (!user) {
      handleBookNow();
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      const bookingResult = await handleBookNow();
      if (!bookingResult || !bookingResult.success) {
        throw new Error('Falha ao criar reserva');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      setPaymentError(error.message || 'Erro ao processar a reserva. Por favor, tente novamente.');
      setIsErrorDialogOpen(true);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>
            {space.pricing_type === 'hourly' 
              ? `R$ ${space.hourly_price} por hora`
              : space.pricing_type === 'both' 
                ? `R$ ${space.price} por dia / R$ ${space.hourly_price} por hora`
                : `R$ ${space.price} por dia`}
          </CardTitle>
          <CardDescription>
            Escolha como deseja reservar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingTypeSelector
            bookingType={bookingType}
            setBookingType={setBookingType}
            pricingType={space.pricing_type}
          />
          
          <BookingDateSelector
            date={date}
            setDate={setDate}
            isDateAvailable={isDateAvailable}
            selectedDateRange={[]}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
            bookingType={bookingType}
          />
          
          <GuestCounter
            guests={guests}
            setGuests={setGuests}
            maxCapacity={space.capacity}
          />
          
          <DurationSelector
            bookingType={bookingType}
            selectedHours={selectedHours}
            setSelectedHours={setSelectedHours}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
            date={date}
            isDateAvailable={isDateAvailable}
          />
          
          <BookingPriceSummary
            bookingType={bookingType}
            price={space.price}
            hourlyPrice={space.hourly_price}
            selectedHours={selectedHours}
            selectedDays={selectedDays}
            totalPrice={bookingType === 'hourly' ? 
              (space.hourly_price || 0) * selectedHours : 
              space.price * selectedDays}
          />
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleReserveClick}
            disabled={isProcessingPayment || !date || authLoading}
          >
            {isProcessingPayment ? 'Processando...' : 'Reservar'}
          </Button>
        </CardFooter>
      </Card>
      
      <BookingErrorDialog
        isOpen={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
        error={paymentError}
      />
    </>
  );
}
