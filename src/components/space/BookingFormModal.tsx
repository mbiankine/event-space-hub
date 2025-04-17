
import React from 'react';
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
import { toast } from 'sonner';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  
  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {bookingConfirmed 
              ? "Confirme sua reserva e prossiga para pagamento" 
              : "Complete os dados da sua reserva"}
          </DialogTitle>
          <DialogDescription>
            {bookingConfirmed
              ? "Confirme os detalhes da sua reserva antes de prosseguir para o pagamento."
              : "Preencha os campos abaixo para finalizar sua reserva."}
          </DialogDescription>
        </DialogHeader>

        {bookingConfirmed ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-900">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Check className="h-5 w-5" />
                <p className="text-sm font-medium">Pré-reserva criada com sucesso!</p>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                Confirme os detalhes abaixo e prossiga para o pagamento.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Espaço:</h4>
                  <p className="font-medium">{space.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Data:</h4>
                  <p className="font-medium">
                    {watch.date ? format(watch.date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : ''}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Convidados:</h4>
                  <p className="font-medium">{watch.guests}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Duração:</h4>
                  <p className="font-medium">
                    {watch.bookingType === 'hourly'
                      ? `${watch.hours} ${watch.hours > 1 ? 'horas' : 'hora'}`
                      : `${watch.days} ${watch.days > 1 ? 'dias' : 'dia'}`}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Evento:</h4>
                <p className="font-medium">{watch.eventType}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Nome:</h4>
                <p className="font-medium">{watch.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email:</h4>
                <p className="font-medium">{watch.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Telefone:</h4>
                <p className="font-medium">{watch.phone}</p>
              </div>
              
              {watch.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Observações:</h4>
                  <p className="font-medium">{watch.notes}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                R$ {watch.bookingType === 'hourly' 
                  ? (space.hourly_price * watch.hours).toFixed(2) 
                  : (space.price * watch.days).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
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
        )}

        {bookingConfirmed && (
          <DialogFooter className="mt-4">
            <Button 
              onClick={onProceedToPayment}
              disabled={isProcessingPayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Prosseguir para Pagamento
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
