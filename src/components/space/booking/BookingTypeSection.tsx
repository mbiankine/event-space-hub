
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, CalendarIcon } from "lucide-react";

interface BookingTypeSectionProps {
  bookingType: "hourly" | "daily";
  setBookingType: (type: "hourly" | "daily") => void;
  pricingType: string;
}

export function BookingTypeSection({
  bookingType,
  setBookingType,
  pricingType
}: BookingTypeSectionProps) {
  if (pricingType !== 'both') return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">Tipo de Reserva</h4>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant={bookingType === "hourly" ? "default" : "outline"} 
          onClick={() => setBookingType("hourly")}
          className="w-full"
        >
          <Clock className="mr-2 h-4 w-4" />
          Por Hora
        </Button>
        <Button 
          variant={bookingType === "daily" ? "default" : "outline"} 
          onClick={() => setBookingType("daily")}
          className="w-full"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Por Dia
        </Button>
      </div>
    </div>
  );
}
