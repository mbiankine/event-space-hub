
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface GuestCounterProps {
  guests: number;
  setGuests: (guests: number) => void;
  maxCapacity: number;
}

export const GuestCounter = ({ guests, setGuests, maxCapacity }: GuestCounterProps) => {
  const decreaseGuests = () => {
    const newValue = Math.max(1, guests - 25);
    setGuests(newValue);
  };

  const increaseGuests = () => {
    const newValue = Math.min(maxCapacity, guests + 25);
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
            onClick={decreaseGuests}
            disabled={guests <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{guests}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={increaseGuests}
            disabled={guests >= maxCapacity}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
