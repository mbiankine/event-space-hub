
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingDateSectionProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  isDateAvailable: (date: Date) => boolean;
  selectedDateRange: Date[];
  selectedDays: number;
  bookingType: "hourly" | "daily";
}

export function BookingDateSection({
  date,
  setDate,
  isDateAvailable,
  selectedDateRange,
  selectedDays,
  bookingType
}: BookingDateSectionProps) {
  const isInSelectedRange = (day: Date) => {
    return selectedDateRange.some(selectedDate => 
      selectedDate.getTime() === day.getTime()
    );
  };

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
    <div className="mb-4">
      <h4 className="font-medium mb-2">Selecione a data</h4>
      <div className="border rounded-md p-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
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
  );
}
