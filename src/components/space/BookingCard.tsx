
import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { BookingTypeSection } from './booking/BookingTypeSection';
import { BookingDateSection } from './booking/BookingDateSection';
import { GuestCounter } from './booking/GuestCounter';
import { DurationSelector } from './booking/DurationSelector';
import { BookingPriceSection } from './booking/BookingPriceSection';
import { CheckInOutSelector } from './booking/CheckInOutSelector';
import { AdditionalAmenitiesSelector } from './booking/AdditionalAmenitiesSelector';
import { CustomAmenity } from '@/types/SpaceTypes';

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
  const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("12:00");
  const [selectedAmenities, setSelectedAmenities] = useState<CustomAmenity[]>([]);

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
      }
    }
    
    setSelectedDateRange(range);
  };

  const calculatePrice = () => {
    const basePrice = bookingType === 'hourly' && space.hourly_price 
      ? space.hourly_price * selectedHours 
      : space.price * selectedDays;
      
    const amenitiesTotal = selectedAmenities.reduce((sum, amenity) => 
      sum + (amenity.price || 0), 0
    );
    
    return basePrice + amenitiesTotal;
  };

  const handleAmenityToggle = (amenity: CustomAmenity) => {
    setSelectedAmenities(current =>
      current.some(a => a.name === amenity.name)
        ? current.filter(a => a.name !== amenity.name)
        : [...current, amenity]
    );
  };

  const handleReserveClick = async () => {
    if (!date) return;

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      const result = await handleBookNow();
      if (!result.success) {
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
          <BookingTypeSection
            bookingType={bookingType}
            setBookingType={setBookingType}
            pricingType={space.pricing_type}
          />
          
          <BookingDateSection
            date={date}
            setDate={setDate}
            isDateAvailable={isDateAvailable}
            selectedDateRange={selectedDateRange}
            selectedDays={selectedDays}
            bookingType={bookingType}
          />
          
          <GuestCounter
            guests={guests}
            setGuests={setGuests}
            maxCapacity={space.capacity}
          />
          
          {bookingType === 'daily' && (
            <CheckInOutSelector
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              onCheckInChange={setCheckInTime}
              onCheckOutChange={setCheckOutTime}
              disabled={!date || isProcessingPayment}
            />
          )}
          
          <DurationSelector
            bookingType={bookingType}
            selectedHours={selectedHours}
            setSelectedHours={setSelectedHours}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
            date={date}
            isDateAvailable={isDateAvailable}
          />
          
          {space.custom_amenities && space.custom_amenities.length > 0 && (
            <AdditionalAmenitiesSelector
              amenities={space.custom_amenities.filter(amenity => amenity.price && amenity.price > 0)}
              selectedAmenities={selectedAmenities}
              onAmenityToggle={handleAmenityToggle}
              disabled={isProcessingPayment}
            />
          )}
          
          <BookingPriceSection
            bookingType={bookingType}
            selectedHours={selectedHours}
            selectedDays={selectedDays}
            space={space}
            calculatePrice={calculatePrice}
            selectedAmenities={selectedAmenities}
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
            <DialogDescription>{paymentError}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsErrorDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
