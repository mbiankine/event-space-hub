import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { BookingTypeSection } from './BookingTypeSection';
import { BookingDateSection } from './BookingDateSection';
import { BookingPriceSection } from './BookingPriceSection';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CheckInOutSelector } from './CheckInOutSelector';
import { AdditionalAmenitiesSelector } from './AdditionalAmenitiesSelector';
import { formatCurrency } from '@/lib/utils';
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
  handleBookNow: () => Promise<{ success: boolean, bookingId?: string }>;
  unavailableDates: Date[];
  space: {
    hourly_price: number;
    price: number;
    pricing_type: string;
    capacity: number;
    custom_amenities: CustomAmenity[];
  };
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
        toast.info(`Só é possível reservar ${range.length} dia(s) consecutivos devido a indisponibilidade de datas.`);
      }
    }
    
    setSelectedDateRange(range);
  };

  const calculatePrice = () => {
    if (bookingType === 'hourly' && space.hourly_price) {
      return space.hourly_price * selectedHours;
    } else if (bookingType === 'daily') {
      return space.price * selectedDays;
    }
    return space.price;
  };

  const handleAmenityToggle = (amenity: CustomAmenity) => {
    setSelectedAmenities(current =>
      current.some(a => a.name === amenity.name)
        ? current.filter(a => a.name !== amenity.name)
        : [...current, amenity]
    );
  };

  const calculateTotalPrice = () => {
    const basePrice = calculatePrice();
    const amenitiesPrice = selectedAmenities.reduce((sum, amenity) => 
      sum + (amenity.price || 0), 0
    );
    return basePrice + amenitiesPrice;
  };

  const handleReserveClick = async () => {
    if (!user) {
      const result = await handleBookNow();
      return result;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      const bookingResult = await handleBookNow();
      
      if (bookingResult.success) {
        const bookingData = {
          check_in_time: bookingType === 'daily' ? checkInTime : null,
          check_out_time: bookingType === 'daily' ? checkOutTime : null,
          selected_amenities: selectedAmenities
        };
      }
      
      return bookingResult;
    } catch (error: any) {
      console.error('Booking error:', error);
      setPaymentError(error.message || 'Erro ao processar a reserva. Por favor, tente novamente.');
      setIsErrorDialogOpen(true);
      return { success: false };
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleGuestsChange = (increment: boolean) => {
    const newValue = increment 
      ? Math.min(space.capacity, guests + 25)
      : Math.max(1, guests - 25);
    setGuests(newValue);
  };

  const handleHoursChange = (increment: boolean) => {
    const newValue = increment
      ? Math.min(24, selectedHours + 1)
      : Math.max(1, selectedHours - 1);
    setSelectedHours(newValue);
  };

  const handleDaysChange = (increment: boolean) => {
    if (!increment && selectedDays <= 1) return;
    
    const newValue = increment
      ? Math.min(30, selectedDays + 1)
      : Math.max(1, selectedDays - 1);
    
    if (increment && date) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + selectedDays);
      if (!isDateAvailable(nextDate)) {
        toast.info("Não é possível adicionar mais dias consecutivos devido à indisponibilidade de datas.");
        return;
      }
    }
    
    setSelectedDays(newValue);
    if (date) calculatePossibleDateRange(date);
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
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Convidados</h4>
            <div className="flex items-center justify-between border rounded-md p-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Convidados</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleGuestsChange(false)}
                  disabled={guests <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{guests}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleGuestsChange(true)}
                  disabled={guests >= space.capacity}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
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
            calculatePrice={calculateTotalPrice}
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
