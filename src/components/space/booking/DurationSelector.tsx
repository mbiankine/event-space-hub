
import React from 'react';
import { Clock, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DurationSelectorProps {
  bookingType: "hourly" | "daily";
  selectedHours: number;
  setSelectedHours: (hours: number) => void;
  selectedDays: number;
  setSelectedDays: (days: number) => void;
  date: Date | undefined;
  isDateAvailable: (date: Date) => boolean;
}

export function DurationSelector({
  bookingType,
  selectedHours,
  setSelectedHours,
  selectedDays,
  setSelectedDays,
  date,
  isDateAvailable
}: DurationSelectorProps) {
  const handleHoursChange = (increment: boolean) => {
    const newValue = increment
      ? Math.min(24, selectedHours + 1)
      : Math.max(1, selectedHours - 1);
    setSelectedHours(newValue);
  };

  const handleDaysChange = (increment: boolean) => {
    if (!increment && selectedDays <= 1) return;
    
    const newValue = increment
      ? Math.min(30, selectedDays + 1)
      : Math.max(1, selectedDays - 1);
    
    if (increment && date) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + selectedDays);
      if (!isDateAvailable(nextDate)) {
        return;
      }
    }
    
    setSelectedDays(newValue);
  };

  if (bookingType === 'hourly') {
    return (
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
              onClick={() => handleHoursChange(false)}
              disabled={selectedHours <= 1}
            >
              -
            </Button>
            <span className="w-8 text-center">{selectedHours}</span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleHoursChange(true)}
              disabled={selectedHours >= 24}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
            onClick={() => handleDaysChange(false)}
            disabled={selectedDays <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{selectedDays}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleDaysChange(true)}
            disabled={selectedDays >= 30}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
