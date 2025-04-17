
import { Button } from "@/components/ui/button";
import { Clock, CalendarIcon } from "lucide-react";

interface DurationSelectorProps {
  bookingType: "hourly" | "daily";
  selectedHours: number;
  setSelectedHours: (hours: number) => void;
  selectedDays: number;
  setSelectedDays: (days: number) => void;
  date: Date | undefined;
  isDateAvailable: (date: Date) => boolean;
}

export const DurationSelector = ({
  bookingType,
  selectedHours,
  setSelectedHours,
  selectedDays,
  setSelectedDays,
  date,
  isDateAvailable
}: DurationSelectorProps) => {
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
  };

  const increaseDays = () => {
    if (bookingType !== 'daily') return;
    
    const newValue = selectedDays + 1;
    
    // Check if adding another day is possible
    if (date) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + selectedDays);
      if (!isDateAvailable(nextDate)) {
        return;
      }
    }
    
    setSelectedDays(Math.min(30, newValue));
  };

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">
        {bookingType === 'hourly' ? 'Duração em horas' : 'Duração em dias'}
      </h4>
      <div className="flex items-center justify-between border rounded-md p-3">
        <div className="flex items-center gap-2">
          {bookingType === 'hourly' ? (
            <>
              <Clock className="h-5 w-5" />
              <span>Horas</span>
            </>
          ) : (
            <>
              <CalendarIcon className="h-5 w-5" />
              <span>Dias</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={bookingType === 'hourly' ? decreaseHours : decreaseDays}
            disabled={bookingType === 'hourly' ? selectedHours <= 1 : selectedDays <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">
            {bookingType === 'hourly' ? selectedHours : selectedDays}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={bookingType === 'hourly' ? increaseHours : increaseDays}
            disabled={bookingType === 'hourly' ? selectedHours >= 24 : selectedDays >= 30}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
