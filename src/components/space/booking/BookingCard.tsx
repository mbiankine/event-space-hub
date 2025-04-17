
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useStripeConfig } from '@/hooks/useStripeConfig';
import { BookingTypeSelector } from './BookingTypeSelector';
import { BookingDateSelector } from './BookingDateSelector';
import { GuestCounter } from './GuestCounter';
import { DurationSelector } from './DurationSelector';
import { BookingPriceSummary } from './BookingPriceSummary';

interface BookingCardProps {
  space: any;
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
  handleBookNow: () => Promise<{ success: boolean; bookingId?: string }>;
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
  const { startStripeCheckout } = useStripeConfig();

  // Update date range when date changes
  useEffect(() => {
    if (date && bookingType === 'daily' && selectedDays > 1) {
      calculatePossibleDateRange(date);
    } else {
      setSelectedDateRange(date ? [date] : []);
    }
  }, [date, selectedDays, bookingType, unavailableDates]);

  const calculatePossibleDateRange = (startDate: Date) => {
    if (!startDate) return;
    
    const range: Date[] = [startDate];
    let canAddMore = true;
    let currentDay = 1;
    
    while (canAddMore && currentDay < selectedDays) {
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + currentDay);
      
      if (isDateAvailable(nextDate)) {
        range.push(nextDate);
        currentDay++;
      } else {
        canAddMore = false;
        setSelectedDays(range.length);
        toast.info(`Só é possível reservar ${range.length} dia(s) consecutivos devido a indisponibilidade de datas.`);
      }
    }
    
    setSelectedDateRange(range);
  };

  const calculateTotalPrice = () => {
    if (bookingType === 'hourly' && space.hourly_price) {
      return space.hourly_price * selectedHours;
    }
    return space.price * selectedDays;
  };

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
      
      if (bookingResult.bookingId) {
        setConfirmedBookingId(bookingResult.bookingId);
        handleProceedToPayment();
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      setPaymentError(error.message || 'Erro ao processar a reserva. Por favor, tente novamente.');
      setIsErrorDialogOpen(true);
      setIsProcessingPayment(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!confirmedBookingId || !space) {
      console.error("Missing booking ID or space details for payment");
      toast.error("Dados incompletos para pagamento");
      return;
    }

    const totalPrice = calculateTotalPrice();
    
    await startStripeCheckout(
      space.id, 
      totalPrice, 
      bookingType === 'daily' ? selectedDays : undefined,
      confirmedBookingId
    );
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
            selectedDateRange={selectedDateRange}
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
            totalPrice={calculateTotalPrice()}
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
      
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erro no Processamento</DialogTitle>
            <DialogDescription>
              {paymentError}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsErrorDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
