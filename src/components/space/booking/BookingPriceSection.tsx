
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface BookingPriceSectionProps {
  bookingType: "hourly" | "daily";
  selectedHours: number;
  selectedDays: number;
  space: any;
  calculatePrice: () => number;
}

export function BookingPriceSection({
  bookingType,
  selectedHours,
  selectedDays,
  space,
  calculatePrice
}: BookingPriceSectionProps) {
  return (
    <>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>
            {bookingType === 'hourly' 
              ? `R$ ${space.hourly_price} x ${selectedHours} horas`
              : `R$ ${space.price} x ${selectedDays} ${selectedDays > 1 ? 'dias' : 'dia'}`}
          </span>
          <span>R$ {calculatePrice().toFixed(2)}</span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>R$ {calculatePrice().toFixed(2)}</span>
      </div>
    </>
  );
}
