
import { useState, useEffect } from 'react';
import { Space, CustomAmenity } from '@/types/SpaceTypes';
import { toast } from 'sonner';

interface UseBookingCardStateProps {
  date: Date | undefined;
  selectedDays: number;
  bookingType: "hourly" | "daily";
  unavailableDates: Date[];
  isDateAvailable: (date: Date) => boolean;
}

export const useBookingCardState = ({
  date,
  selectedDays,
  bookingType,
  unavailableDates,
  isDateAvailable
}: UseBookingCardStateProps) => {
  const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("12:00");
  const [selectedAmenities, setSelectedAmenities] = useState<CustomAmenity[]>([]);
  
  useEffect(() => {
    if (date && bookingType === 'daily' && selectedDays > 1) {
      calculatePossibleDateRange(date);
    } else {
      setSelectedDateRange(date ? [date] : []);
    }
  }, [date, selectedDays, bookingType, unavailableDates]);

  const calculatePossibleDateRange = (startDate: Date) => {
    if (!startDate) return;
    
    const range: Date[] = [startDate];
    let canAddMore = true;
    let currentDay = 1;
    
    while (canAddMore && currentDay < selectedDays) {
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + currentDay);
      
      if (isDateAvailable(nextDate)) {
        range.push(nextDate);
        currentDay++;
      } else {
        canAddMore = false;
        toast.info(`Só é possível reservar ${range.length} dia(s) consecutivos devido a indisponibilidade de datas.`);
      }
    }
    
    setSelectedDateRange(range);
  };

  const handleAmenityToggle = (amenity: CustomAmenity) => {
    setSelectedAmenities(current =>
      current.some(a => a.name === amenity.name)
        ? current.filter(a => a.name !== amenity.name)
        : [...current, amenity]
    );
  };

  return {
    selectedDateRange,
    checkInTime,
    setCheckInTime,
    checkOutTime,
    setCheckOutTime,
    selectedAmenities,
    handleAmenityToggle
  };
};
