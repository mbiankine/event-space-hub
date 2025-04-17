
import React from 'react';
import { SpaceHeader } from "@/components/space/SpaceHeader";
import { SpaceGallery } from "@/components/space/SpaceGallery";
import { SpaceContent } from "@/components/space/SpaceContent";
import { BookingCard } from "@/components/space/booking/BookingCard";
import { Space } from '@/types/SpaceTypes';

interface SpaceDetailContentProps {
  space: Space;
  imageUrls: string[];
  bookingProps: {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    guests: number;
    setGuests: (guests: number) => void;
    selectedHours: number;
    setSelectedHours: (hours: number) => void;
    selectedDays: number;
    setSelectedDays: (days: number) => void;
    bookingType: "hourly" | "daily";
    setBookingType: (type: "hourly" | "daily") => void;
    isDateAvailable: (date: Date) => boolean;
    handleBookNow: () => Promise<{ success: boolean; bookingId?: string }>;
    unavailableDates: Date[];
  };
  onMessageClick: () => void;
}

export function SpaceDetailContent({ 
  space, 
  imageUrls, 
  bookingProps,
  onMessageClick 
}: SpaceDetailContentProps) {
  return (
    <>
      <SpaceHeader title={space.title} location={space.location} />
      <SpaceGallery imageUrls={imageUrls} title={space.title} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <SpaceContent 
            space={space}
            onMessageClick={onMessageClick}
          />
        </div>
        
        <div className="space-y-6">
          <BookingCard 
            space={space}
            {...bookingProps}
          />
        </div>
      </div>
    </>
  );
}
