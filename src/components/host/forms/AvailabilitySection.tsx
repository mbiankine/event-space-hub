
import { Control } from 'react-hook-form';
import { ptBR } from 'date-fns/locale';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { FormSection } from './FormSection';
import { SpaceFormValues } from './types';

interface AvailabilitySectionProps {
  control: Control<SpaceFormValues>;
}

export function AvailabilitySection({ control }: AvailabilitySectionProps) {
  const selectAllDaysInMonth = (date: Date, onChange: (dates: Date[]) => void, currentDates: Date[]) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const allDays = eachDayOfInterval({ start, end });
    const today = new Date();
    
    // Filtrar as datas para incluir apenas datas futuras ou o dia atual
    const futureDays = allDays.filter(date => 
      !isBefore(date, today) || format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'));
    
    // Filtrar datas que já estão no current month para evitar duplicatas
    const currentDatesWithoutThisMonth = currentDates.filter(d => 
      d.getMonth() !== date.getMonth() || d.getFullYear() !== date.getFullYear());
    
    // Adicionar todas as datas futuras do mês selecionado
    onChange([...currentDatesWithoutThisMonth, ...futureDays]);
  };

  return (
    <FormSection title="Disponibilidade">
      <FormField
        control={control}
        name="availability"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Selecione as datas disponíveis</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value && field.value.length > 0
                      ? `${field.value.length} data(s) selecionada(s)`
                      : "Selecione as datas"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-2 border-b">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const today = new Date();
                      selectAllDaysInMonth(today, field.onChange, field.value || []);
                    }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Selecionar todo o mês atual
                  </Button>
                </div>
                <Calendar
                  initialFocus
                  mode="multiple"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date() && format(date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
}
