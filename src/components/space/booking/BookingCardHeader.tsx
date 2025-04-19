
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookingCardPrice } from './BookingCardPrice';
import { Space } from '@/types/SpaceTypes';

interface BookingCardHeaderProps {
  space: Space;
}

export function BookingCardHeader({ space }: BookingCardHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>
        <BookingCardPrice space={space} />
      </CardTitle>
      <CardDescription>
        Escolha como deseja reservar
      </CardDescription>
    </CardHeader>
  );
}
