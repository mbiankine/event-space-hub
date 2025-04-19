
import React from 'react';
import { Space } from '@/types/SpaceTypes';

interface BookingCardPriceProps {
  space: Space;
}

export function BookingCardPrice({ space }: BookingCardPriceProps) {
  return (
    <div>
      {space.pricing_type === 'hourly' 
        ? `R$ ${space.hourly_price || 0} por hora`
        : space.pricing_type === 'both' 
          ? `R$ ${space.price || 0} por dia / R$ ${space.hourly_price || 0} por hora`
          : `R$ ${space.price || 0} por dia`}
    </div>
  );
}
