
import React, { useState, useEffect } from 'react';
import { format, addDays, isWithinInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useStripeConfig } from '@/hooks/useStripeConfig';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isStripeConfigMissing, setIsStripeConfigMissing] = useState(false);
  const { startStripeCheckout } = useStripeConfig();
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
  
  // Reset days when switching booking types
  useEffect(() => {
    if (bookingType === 'hourly') {
      setSelectedDays(1);
    }
  }, [bookingType, setSelectedDays]);
  
  // Update date range when date changes
  useEffect(() => {
    if (date && bookingType === 'daily' && selectedDays > 1) {
      calculatePossibleDateRange(date);
    } else {
      setSelectedDateRange(date ? [date] : []);
    }
  }, [date, selectedDays, bookingType, unavailableDates]);
  
  // Calculate possible consecutive date range
  const calculatePossibleDateRange = (startDate: Date) => {
    if (!startDate) return;
    
    const range: Date[] = [startDate];
    let canAddMore = true;
    let currentDay = 1;
    
    // Try to add days until we reach selectedDays or hit an unavailable date
    while (canAddMore && currentDay < selectedDays) {
      const nextDate = addDays(startDate, currentDay);
      
      if (isDateAvailable(nextDate)) {
        range.push(nextDate);
        currentDay++;
      } else {
        // Found unavailable date, can't add more
        canAddMore = false;
        
        // Update selectedDays to match what's actually available
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
  
  const totalPrice = calculatePrice();

  const decreaseGuests = () => {
    const newValue = Math.max(1, guests - 25);
    setGuests(newValue);
  };

  const increaseGuests = () => {
    const newValue = Math.min(space.capacity, guests + 25);
    setGuests(newValue);
  };

  const decreaseHours = () => {
    const newValue = Math.max(1, selectedHours - 1);
    setSelectedHours(newValue);
  };

  const increaseHours = () => {
    const newValue = Math.min(24, selectedHours + 1);
    setSelectedHours(newValue);
  };

  const decreaseDays = () => {
    if (selectedDays <= 1) return;
    
    const newValue = Math.max(1, selectedDays - 1);
    setSelectedDays(newValue);
    
    // Recalculate date range with new day count
    if (date) calculatePossibleDateRange(date);
  };

  const increaseDays = () => {
    if (bookingType !== 'daily') return;
    
    const newValue = selectedDays + 1;
    
    // Check if adding another day is possible with current date selection
    if (date) {
      const nextDate = addDays(date, selectedDays);
      if (!isDateAvailable(nextDate)) {
        toast.info("Não é possível adicionar mais dias consecutivos devido à indisponibilidade de datas.");
        return;
      }
    }
    
    setSelectedDays(Math.min(30, newValue));
    
    // Recalculate date range with new day count
    if (date) calculatePossibleDateRange(date);
  };
  
  // Check if date is in our selected date range
  const isInSelectedRange = (day: Date) => {
    return selectedDateRange.some(selectedDate => isSameDay(day, selectedDate));
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

    console.log(`Proceeding to payment for booking: ${confirmedBookingId}`);
    let price = 0;
    let days;
    
    if (bookingType === 'hourly') {
      price = (space.hourly_price || 0) * selectedHours;
    } else {
      price = space.price * selectedDays;
      days = selectedDays;
    }
    
    console.log(`Calculated price: ${price}, Days: ${days || 'N/A'}`);
    const result = await startStripeCheckout(space.id, price, days, confirmedBookingId);
    console.log(`Stripe checkout result: ${result ? 'Success' : 'Failed'}`);
  };
  
  // Text to show dates being reserved
  const getDateRangeText = () => {
    if (!date) return "Escolha uma data";
    
    if (bookingType === 'hourly' || selectedDays === 1) {
      return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
    }
    
    if (selectedDateRange.length > 1) {
      const lastDate = selectedDateRange[selectedDateRange.length - 1];
      return `${format(date, "dd", { locale: ptBR })} - ${format(lastDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}`;
    }
    
    return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
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
          {space.pricing_type === 'both' && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Tipo de Reserva</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={bookingType === "hourly" ? "default" : "outline"} 
                  onClick={() => setBookingType("hourly")}
                  className="w-full"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Por Hora
                </Button>
                <Button 
                  variant={bookingType === "daily" ? "default" : "outline"} 
                  onClick={() => setBookingType("daily")}
                  className="w-full"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Por Dia
                </Button>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h4 className="font-medium mb-2">Selecione a data</h4>
            <div className="border rounded-md p-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateRangeText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-3 pointer-events-auto"
                    fromDate={new Date()}
                    disabled={(date) => !isDateAvailable(date)}
                    modifiers={{
                      selected: isInSelectedRange
                    }}
                    modifiersStyles={{
                      selected: { backgroundColor: '#0284c7', color: 'white' }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {bookingType === 'daily' && selectedDays > 1 && (
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedDateRange.length > 0 ? (
                  <span>
                    Reservando {selectedDateRange.length} dia(s) consecutivo(s)
                  </span>
                ) : (
                  <span>Selecione uma data inicial</span>
                )}
              </div>
            )}
          </div>
          
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
                  onClick={decreaseGuests}
                  disabled={guests <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{guests}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseGuests}
                  disabled={guests >= space.capacity}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          {bookingType === 'hourly' ? (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Duração em horas</h4>
              <div className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>Horas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={decreaseHours}
                    disabled={selectedHours <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{selectedHours}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={increaseHours}
                    disabled={selectedHours >= 24}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Duração em dias</h4>
              <div className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={decreaseDays}
                    disabled={selectedDays <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{selectedDays}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={increaseDays}
                    disabled={selectedDays >= 30}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>
                {bookingType === 'hourly' 
                  ? `R$ ${space.hourly_price} x ${selectedHours} horas`
                  : `R$ ${space.price} x ${selectedDays} ${selectedDays > 1 ? 'dias' : 'dia'}`}
              </span>
              <span>R$ {calculatePrice().toFixed(2)}</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
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
          {isStripeConfigMissing ? (
            <div>
              <p className="mb-4 text-amber-600">
                O sistema de pagamento não está configurado corretamente. Esta é uma mensagem para administradores.
              </p>
              <p className="text-sm text-gray-500">
                Administradores precisam configurar a chave secreta do Stripe nas configurações do projeto.
              </p>
            </div>
          ) : null}
          <DialogFooter>
            <Button onClick={() => setIsErrorDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
