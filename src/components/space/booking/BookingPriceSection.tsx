
import React from 'react';
import { CustomAmenity, Space } from '@/types/SpaceTypes';

interface BookingPriceSectionProps {
  bookingType: "hourly" | "daily";
  selectedHours: number;
  selectedDays: number;
  space: Space;
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
    : (space.price || 0) * selectedDays;
    
  const amenitiesTotal = selectedAmenities.reduce((sum, amenity) => 
    sum + (amenity.price || 0), 0
  );
  
  const totalPrice = calculatePrice();

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-medium mb-3">Resumo de Preços</h4>
      <div className="space-y-2 text-sm">
        {bookingType === 'hourly' ? (
          <div className="flex justify-between">
            <span>R$ {space.hourly_price || 0} x {selectedHours} hora(s)</span>
            <span>R$ {basePrice.toFixed(2)}</span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span>R$ {space.price || 0} x {selectedDays} dia(s)</span>
            <span>R$ {basePrice.toFixed(2)}</span>
          </div>
        )}
        
        {selectedAmenities.length > 0 && (
          <>
            <div className="flex justify-between font-medium">
              <span>Amenidades adicionais</span>
              <span>R$ {amenitiesTotal.toFixed(2)}</span>
            </div>
            {selectedAmenities.map((amenity, index) => (
              <div key={index} className="flex justify-between pl-4 text-gray-600">
                <span>{amenity.name}</span>
                <span>R$ {amenity.price.toFixed(2)}</span>
              </div>
            ))}
          </>
        )}
        
        <div className="flex justify-between border-t pt-2 font-medium">
          <span>Total</span>
          <span>R$ {totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
