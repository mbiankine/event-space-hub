
import { useState } from 'react';

export const useBookingState = () => {
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState(25);
  const [selectedHours, setSelectedHours] = useState(4);
  const [selectedDays, setSelectedDays] = useState(1);
  const [bookingType, setBookingType] = useState<"hourly" | "daily">("hourly");

  return {
    date,
    setDate,
    guests,
    setGuests,
    selectedHours,
    setSelectedHours,
    selectedDays,
    setSelectedDays,
    bookingType,
    setBookingType,
  };
};
