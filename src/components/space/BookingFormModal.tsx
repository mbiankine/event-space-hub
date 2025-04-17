
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { BookingConfirmationView } from './booking/BookingConfirmationView';

export function BookingFormModal({
  isOpen,
  onClose,
  onSubmit,
  onProceedToPayment,
  form,
  space,
  isSubmitting,
  isDateAvailable,
  bookingConfirmed,
  isProcessingPayment,
}) {
  const watch = form.watch();
  const { user, profile } = useAuth();
  
  // Auto-fill form with user data when modal opens
  useEffect(() => {
    if (isOpen && user && profile) {
      // Only set these values if we're not already in confirmation mode
      if (!bookingConfirmed) {
        form.setValue('name', profile.full_name || '');
        form.setValue('email', user.email || '');
        if (profile.phone) {
          form.setValue('phone', profile.phone);
        }
      }
    }
  }, [isOpen, user, profile, form, bookingConfirmed]);
  
  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Render confirmation view when booking is confirmed
  if (bookingConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Confirme sua reserva e prossiga para pagamento
            </DialogTitle>
            <DialogDescription>
              Confirme os detalhes da sua reserva antes de prosseguir para o pagamento.
            </DialogDescription>
          </DialogHeader>
          
          <BookingConfirmationView 
            watch={watch}
            space={space}
            isProcessingPayment={isProcessingPayment}
            onProceedToPayment={onProceedToPayment}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Complete os dados da sua reserva
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para finalizar sua reserva.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de evento</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Aniversário, casamento, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Alguma informação adicional sobre o evento"
                      className="resize-none h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Informações da reserva:</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Data: </span>
                  <span className="font-medium">
                    {watch.date ? format(watch.date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : ''}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Convidados: </span>
                  <span className="font-medium">{watch.guests}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duração: </span>
                  <span className="font-medium">
                    {watch.bookingType === 'hourly'
                      ? `${watch.hours} ${watch.hours > 1 ? 'horas' : 'hora'}`
                      : `${watch.days} ${watch.days > 1 ? 'dias' : 'dia'}`}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor total: </span>
                  <span className="font-medium">
                    R$ {watch.bookingType === 'hourly' 
                      ? (space.hourly_price * watch.hours).toFixed(2) 
                      : (space.price * (watch.days || 1)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Confirmar Reserva'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
