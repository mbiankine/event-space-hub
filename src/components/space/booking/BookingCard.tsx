
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { BookingCardHeader } from './BookingCardHeader';
import { BookingTypeSection } from './BookingTypeSection';
import { BookingDateSection } from './BookingDateSection';
import { GuestCounter } from './GuestCounter';
import { DurationSelector } from './DurationSelector';
import { BookingPriceSection } from './BookingPriceSection';
import { AdditionalAmenitiesSelector } from './AdditionalAmenitiesSelector';
import { useBookingCardState } from '@/hooks/useBookingCardState';
import { Space } from '@/types/SpaceTypes';
import { Loader2 } from 'lucide-react';

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

  const {
    selectedDateRange,
    selectedAmenities,
    handleAmenityToggle
  } = useBookingCardState({
    date,
    selectedDays,
    bookingType,
    unavailableDates,
    isDateAvailable
  });

  const calculatePrice = () => {
    const basePrice = bookingType === 'hourly' && space.hourly_price
      ? space.hourly_price * selectedHours
      : (space.price || 0) * selectedDays;
      
    const amenitiesTotal = selectedAmenities.reduce((sum, amenity) => 
      sum + (amenity.price || 0), 0
    );
    
    return basePrice + amenitiesTotal;
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
        <BookingCardHeader space={space} />
        <CardContent>
          <BookingTypeSection
            bookingType={bookingType}
            setBookingType={setBookingType}
            pricingType={space.pricing_type || 'daily'}
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
            {isProcessingPayment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Reservar'
            )}
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
