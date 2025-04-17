
import React, { useState } from 'react';
import { format, addHours, parse } from 'date-fns';
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
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  handleBookNow: () => void;
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
  handleBookNow
}: BookingCardProps) {
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  
  // Calculate total price based on pricing type and booking type
  const calculatePrice = () => {
    if (bookingType === 'hourly' && space.hourly_price) {
      return space.hourly_price * selectedHours;
    } else if (bookingType === 'daily') {
      return space.price * selectedDays;
    }
    return space.price;
  };
  
  // No service fee as requested
  const totalPrice = calculatePrice();

  // Helper functions to handle state updates correctly
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
    const newValue = Math.max(1, selectedDays - 1);
    setSelectedDays(newValue);
  };

  const increaseDays = () => {
    const newValue = Math.min(30, selectedDays + 1);
    setSelectedDays(newValue);
  };

  const handleProcessPayment = async () => {
    try {
      setIsProcessingPayment(true);
      setPaymentError(null);
      
      // First call the booking function to create a booking record
      handleBookNow();
      
      // Prepare data for Stripe checkout
      const paymentData = {
        spaceId: space.id,
        spaceTitle: space.title,
        bookingType,
        amount: totalPrice,
        quantity: bookingType === 'hourly' ? selectedHours : selectedDays,
        unit: bookingType === 'hourly' ? 'hora(s)' : 'dia(s)',
      };
      
      // Call the Supabase Edge Function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: paymentData
      });
      
      if (error) {
        console.error('Error creating checkout session:', error);
        setPaymentError('Erro ao processar o pagamento. Por favor, tente novamente.');
        setIsErrorDialogOpen(true);
        return;
      }
      
      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setPaymentError('Não foi possível criar uma sessão de pagamento.');
        setIsErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentError('Erro ao processar o pagamento. Por favor, tente novamente.');
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
          {/* Pricing Type Selection */}
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
                    {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
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
                  />
                </PopoverContent>
              </Popover>
            </div>
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
            onClick={handleProcessPayment}
            disabled={isProcessingPayment || !date}
          >
            {isProcessingPayment ? 'Processando...' : 'Reservar e Pagar'}
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
          <div className="flex justify-end">
            <Button onClick={() => setIsErrorDialogOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
