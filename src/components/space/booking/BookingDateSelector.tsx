
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from "lucide-react";
import { format, addDays, isAfter, isBefore, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface BookingDateSelectorProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  isDateAvailable: (date: Date) => boolean;
  selectedDateRange: Date[];
  selectedDays: number;
  bookingType: "hourly" | "daily";
}

export function BookingDateSelector({
  date,
  setDate,
  isDateAvailable,
  selectedDateRange,
  selectedDays,
  bookingType
}: BookingDateSelectorProps) {
  const minDate = addDays(new Date(), 2);
  
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

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setDate(undefined);
      return;
    }

    if (bookingType === 'hourly') {
      if (isBefore(newDate, minDate)) {
        toast.error("Somente datas a partir de 2 dias no futuro podem ser reservadas");
        return;
      }
      
      if (!isDateAvailable(newDate)) {
        toast.error("Esta data não está disponível para reserva");
        return;
      }
      
      setDate(newDate);
      return;
    }

    // For daily bookings with date range selection
    if (!date) {
      if (isBefore(newDate, minDate)) {
        toast.error("Somente datas a partir de 2 dias no futuro podem ser reservadas");
        return;
      }
      
      if (!isDateAvailable(newDate)) {
        toast.error("Esta data não está disponível para reserva");
        return;
      }
      
      setDate(newDate);
      return;
    }

    // Check if dates are sequential
    const daysDiff = Math.abs(differenceInDays(newDate, date));
    
    if (daysDiff >= selectedDays) {
      // If the new date is after the current date, adjust the range
      if (isAfter(newDate, date)) {
        // Check if all dates in between are available
        let allDatesAvailable = true;
        const tempDate = new Date(date);
        for (let i = 1; i < selectedDays; i++) {
          tempDate.setDate(tempDate.getDate() + 1);
          if (!isDateAvailable(tempDate)) {
            allDatesAvailable = false;
            break;
          }
        }

        if (!allDatesAvailable) {
          toast.error("Existem datas indisponíveis no período selecionado");
          return;
        }
      } else {
        // If selecting a date before the current end date
        let allDatesAvailable = true;
        const tempDate = new Date(newDate);
        for (let i = 1; i < selectedDays; i++) {
          tempDate.setDate(tempDate.getDate() + 1);
          if (!isDateAvailable(tempDate)) {
            allDatesAvailable = false;
            break;
          }
        }

        if (!allDatesAvailable) {
          toast.error("Existem datas indisponíveis no período selecionado");
          return;
        }
      }
    }

    setDate(newDate);
  };

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">Selecione a data</h4>
      <div className="text-sm text-muted-foreground mb-2">
        Somente datas a partir de 2 dias no futuro podem ser reservadas
      </div>
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
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="p-3 pointer-events-auto"
              fromDate={minDate}
              disabled={(date) => !isDateAvailable(date) || isBefore(date, minDate)}
              modifiers={{
                selected: (day) => selectedDateRange.some(d => 
                  d.getDate() === day.getDate() &&
                  d.getMonth() === day.getMonth() &&
                  d.getFullYear() === day.getFullYear()
                )
              }}
              modifiersStyles={{
                selected: { backgroundColor: '#0284c7', color: 'white' }
              }}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {bookingType === 'daily' && (
        <div className="mt-2 text-sm text-muted-foreground">
          {selectedDateRange.length > 0 ? (
            <span>
              {selectedDateRange.length} dia(s) selecionado(s)
            </span>
          ) : (
            <span>Selecione as datas</span>
          )}
        </div>
      )}
    </div>
  );
}
