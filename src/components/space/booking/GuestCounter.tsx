
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestCounterProps {
  guests: number;
  setGuests: (guests: number) => void;
  maxCapacity: number;
}

export function GuestCounter({ guests, setGuests, maxCapacity }: GuestCounterProps) {
  const handleGuestsChange = (increment: boolean) => {
    const newValue = increment 
      ? Math.min(maxCapacity, guests + 25)
      : Math.max(1, guests - 25);
    setGuests(newValue);
  };

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">Convidados</h4>
      <div className="flex items-center justify-between border rounded-md p-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>Convidados</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleGuestsChange(false)}
            disabled={guests <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{guests}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleGuestsChange(true)}
            disabled={guests >= maxCapacity}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
