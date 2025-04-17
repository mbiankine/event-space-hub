
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface SearchDateProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export const SearchDate = ({ date, setDate }: SearchDateProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 min-w-[120px] justify-start py-6 px-4 border-r border-border">
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm truncate text-left">
            {date ? format(date, 'dd MMM', { locale: pt }) : 'Data'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <div className="p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="pointer-events-auto"
            fromDate={new Date()}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
