
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface SearchGuestsProps {
  guestCount: number;
  handleGuestChange: (increment: number) => void;
}

export const SearchGuests = ({ guestCount, handleGuestChange }: SearchGuestsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 min-w-[120px] justify-start py-6 px-4">
          <Users className="h-4 w-4" />
          <span className="text-sm truncate text-left">
            {guestCount} {guestCount === 1 ? 'convidado' : 'convidados'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="p-4">
          <h4 className="text-sm font-medium mb-4 text-left">Número de convidados</h4>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleGuestChange(-1)}
              disabled={guestCount <= 1}
            >
              -
            </Button>
            <span className="text-lg font-medium">{guestCount}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleGuestChange(1)}
              disabled={guestCount >= 100}
            >
              +
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
