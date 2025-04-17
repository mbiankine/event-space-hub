
import React from 'react';
import { format, addHours, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Clock, Check, ArrowRight } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const bookingFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  guests: z.number().min(1, { message: "Mínimo 1 convidado" }).max(1000, { message: "Máximo 1000 convidados" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  hours: z.number().min(1, { message: "Mínimo 1 hora" }).max(24, { message: "Máximo 24 horas" }),
  eventType: z.string().min(1, { message: "Tipo de evento é obrigatório" }),
  notes: z.string().optional(),
  bookingType: z.enum(["hourly", "daily"]),
  days: z.number().min(1, { message: "Mínimo 1 dia" }).max(30, { message: "Máximo 30 dias" }).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BookingFormValues) => void;
  onProceedToPayment: () => void;
  form: any;
  space: any;
  isSubmitting: boolean;
  isDateAvailable: (date: Date) => boolean;
  bookingConfirmed: boolean;
  isProcessingPayment: boolean;
}

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
  isProcessingPayment
}: BookingFormModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{bookingConfirmed ? 'Confirmação de Reserva' : `Reservar ${space.title}`}</CardTitle>
          <CardDescription>
            {bookingConfirmed 
              ? 'Confira os detalhes da sua reserva antes de prosseguir para o pagamento' 
              : 'Preencha os dados para finalizar sua reserva'}
          </CardDescription>
        </CardHeader>
        
        {bookingConfirmed ? (
          <div>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">Reserva pré-confirmada</h3>
                  <p className="text-sm text-green-700">Sua reserva foi registrada. Prossiga para o pagamento para confirmar.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Detalhes da Reserva</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{form.getValues('name')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{form.getValues('email')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{form.getValues('phone')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tipo de evento</p>
                    <p className="font-medium">{form.getValues('eventType')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{format(form.getValues('date'), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Convidados</p>
                    <p className="font-medium">{form.getValues('guests')} pessoas</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duração</p>
                  <p className="font-medium">
                    {form.getValues('bookingType') === 'hourly'
                      ? `${form.getValues('hours')} ${form.getValues('hours') > 1 ? 'horas' : 'hora'}`
                      : `${form.getValues('days')} ${form.getValues('days') > 1 ? 'dias' : 'dia'}`
                    }
                  </p>
                </div>
                
                {form.getValues('notes') && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Observações</p>
                    <p className="font-medium">{form.getValues('notes')}</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    {form.watch('bookingType') === 'hourly' 
                      ? `R$ ${space.hourly_price} x ${form.watch('hours')} horas`
                      : `R$ ${space.price} x ${form.watch('days') || 1} ${(form.watch('days') || 1) > 1 ? 'dias' : 'dia'}`}
                  </span>
                  <span>R$ {
                    form.watch('bookingType') === 'hourly' 
                      ? (space.hourly_price * form.watch('hours')).toFixed(2)
                      : (space.price * (form.watch('days') || 1)).toFixed(2)
                  }</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>R$ {(
                  form.watch('bookingType') === 'hourly' 
                    ? (space.hourly_price * form.watch('hours'))
                    : (space.price * (form.watch('days') || 1))
                ).toFixed(2)}</span>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                type="button"
                onClick={onProceedToPayment}
                disabled={isProcessingPayment}
                className="gap-2"
              >
                {isProcessingPayment ? 'Processando...' : 'Prosseguir para pagamento'}
                {!isProcessingPayment && <ArrowRight className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="seu.email@exemplo.com" {...field} />
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
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bookingType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo de Reserva</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            disabled={space.pricing_type !== 'both'}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="hourly" 
                                id="booking-hourly"
                                disabled={space.pricing_type === 'daily'}
                              />
                              <label htmlFor="booking-hourly" className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                <Clock className="mr-2 h-4 w-4" />
                                Por Hora
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="daily" 
                                id="booking-daily"
                                disabled={space.pricing_type === 'hourly'}
                              />
                              <label htmlFor="booking-daily" className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Por Diária
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data do evento</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "dd 'de' MMMM, yyyy", { locale: ptBR })
                                  ) : (
                                    <span>Escolha uma data</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => !isDateAvailable(date)}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de evento</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Selecione o tipo de evento</option>
                              <option value="Casamento">Casamento</option>
                              <option value="Aniversário">Aniversário</option>
                              <option value="Corporativo">Corporativo</option>
                              <option value="Formatura">Formatura</option>
                              <option value="Outro">Outro</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="guests"
                      render={({ field: { onChange, ...rest } }) => (
                        <FormItem>
                          <FormLabel>Número de convidados</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md h-10">
                              <Button 
                                type="button"
                                variant="ghost" 
                                className="h-full px-3" 
                                onClick={() => {
                                  const newValue = Math.max(1, rest.value - 10);
                                  onChange(newValue);
                                }}
                              >
                                -
                              </Button>
                              <Input 
                                className="border-none text-center" 
                                type="number"
                                onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                                {...rest}
                              />
                              <Button 
                                type="button"
                                variant="ghost" 
                                className="h-full px-3" 
                                onClick={() => {
                                  const newValue = Math.min(space.capacity, rest.value + 10);
                                  onChange(newValue);
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('bookingType') === 'hourly' ? (
                      <FormField
                        control={form.control}
                        name="hours"
                        render={({ field: { onChange, ...rest } }) => (
                          <FormItem>
                            <FormLabel>Duração (horas)</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-md h-10">
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  className="h-full px-3" 
                                  onClick={() => {
                                    const newValue = Math.max(1, rest.value - 1);
                                    onChange(newValue);
                                  }}
                                >
                                  -
                                </Button>
                                <Input 
                                  className="border-none text-center" 
                                  type="number"
                                  min={1}
                                  max={24}
                                  onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                                  {...rest}
                                />
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  className="h-full px-3" 
                                  onClick={() => {
                                    const newValue = Math.min(24, rest.value + 1);
                                    onChange(newValue);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        control={form.control}
                        name="days"
                        render={({ field: { onChange, ...rest } }) => (
                          <FormItem>
                            <FormLabel>Duração (dias)</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-md h-10">
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  className="h-full px-3" 
                                  onClick={() => {
                                    const newValue = Math.max(1, rest.value || 1 - 1);
                                    onChange(newValue);
                                  }}
                                >
                                  -
                                </Button>
                                <Input 
                                  className="border-none text-center" 
                                  type="number"
                                  min={1}
                                  max={30}
                                  onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                                  {...rest}
                                />
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  className="h-full px-3" 
                                  onClick={() => {
                                    const newValue = Math.min(30, (rest.value || 1) + 1);
                                    onChange(newValue);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações para o anfitrião</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Compartilhe detalhes sobre seu evento ou necessidades especiais"
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {form.watch('bookingType') === 'hourly' 
                        ? `R$ ${space.hourly_price} x ${form.watch('hours')} horas`
                        : `R$ ${space.price} x ${form.watch('days') || 1} ${(form.watch('days') || 1) > 1 ? 'dias' : 'dia'}`}
                    </span>
                    <span>R$ {
                      form.watch('bookingType') === 'hourly' 
                        ? (space.hourly_price * form.watch('hours')).toFixed(2)
                        : (space.price * (form.watch('days') || 1)).toFixed(2)
                    }</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R$ {(
                    form.watch('bookingType') === 'hourly' 
                      ? (space.hourly_price * form.watch('hours'))
                      : (space.price * (form.watch('days') || 1))
                  ).toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Processando...' : 'Confirmar reserva'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
