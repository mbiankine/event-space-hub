
import React from 'react';
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
import { Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function BookingConfirmationForm({ form, watch, isSubmitting, onSubmit, space }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Confirmar Reserva'
          )}
        </Button>
      </form>
    </Form>
  );
}
