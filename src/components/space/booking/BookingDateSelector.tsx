
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  setSelectedDays: (days: number) => void;
  bookingType: "hourly" | "daily";
}

export const BookingDateSelector = ({
  date,
  setDate,
  isDateAvailable,
  selectedDateRange,
  selectedDays,
  setSelectedDays,
  bookingType
}: BookingDateSelectorProps) => {
  // Get the minimum allowed date (2 days from now)
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

    // If hourly booking, just set the date
    if (bookingType === 'hourly') {
      // Check if date is at least 2 days in the future and available
      if (isBefore(newDate, minDate)) {
        toast.error("Somente datas a partir de 2 dias no futuro podem ser reservadas");
        return;
      }
      
      if (!isDateAvailable(newDate)) {
        toast.error("Esta data não está disponível para reserva");
        return;
      }
      
      setDate(newDate);
      setSelectedDays(1);
      return;
    }

    // For daily bookings
    if (!date) {
      // Check if date is at least 2 days in the future and available
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

  const isInSelectedRange = (day: Date) => {
    return selectedDateRange.some(selectedDate => 
      selectedDate.getDate() === day.getDate() &&
      selectedDate.getMonth() === day.getMonth() &&
      selectedDate.getFullYear() === day.getFullYear()
    );
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
                selected: isInSelectedRange
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
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))}
              disabled={selectedDays <= 1}
            >
              -
            </Button>
            <span className="min-w-[40px] text-center">{selectedDays}</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                if (date) {
                  // Check if next day is available
                  const nextDate = addDays(date, selectedDays);
                  if (isDateAvailable(nextDate)) {
                    setSelectedDays(selectedDays + 1);
                  } else {
                    toast.error("Próximo dia não está disponível");
                  }
                } else {
                  setSelectedDays(selectedDays + 1);
                }
              }}
              disabled={selectedDays >= 30}
            >
              +
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              {selectedDays > 1 ? 'dias consecutivos' : 'dia'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
