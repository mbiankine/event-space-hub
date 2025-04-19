
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { CustomAmenity } from '@/types/SpaceTypes';
import { formatCurrency } from '@/lib/utils';

interface BookingPriceSectionProps {
  bookingType: "hourly" | "daily";
  selectedHours: number;
  selectedDays: number;
  space: any;
  calculatePrice: () => number;
  selectedAmenities: CustomAmenity[];
}

export function BookingPriceSection({
  bookingType,
  selectedHours,
  selectedDays,
  space,
  calculatePrice,
  selectedAmenities
}: BookingPriceSectionProps) {
  const basePrice = bookingType === 'hourly' 
    ? (space.hourly_price || 0) * selectedHours
    : space.price * selectedDays;

  const amenitiesTotal = selectedAmenities.reduce((sum, amenity) => 
    sum + (amenity.price || 0), 0
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>
            {bookingType === 'hourly' 
              ? `${formatCurrency(space.hourly_price || 0)} × ${selectedHours} horas`
              : `${formatCurrency(space.price)} × ${selectedDays} ${selectedDays > 1 ? 'dias' : 'dia'}`}
          </span>
          <span>{formatCurrency(basePrice)}</span>
        </div>

        {selectedAmenities.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Serviços adicionais:</p>
              {selectedAmenities.map(amenity => (
                <div key={amenity.name} className="flex justify-between text-sm">
                  <span>{amenity.name}</span>
                  <span>{formatCurrency(amenity.price || 0)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatCurrency(calculatePrice())}</span>
      </div>
    </div>
  );
}
