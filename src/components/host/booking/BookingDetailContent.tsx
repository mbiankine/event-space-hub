
import { Card } from "@/components/ui/card";
import BookingMainInfo from "./BookingMainInfo";
import BookingClientInfo from "./BookingClientInfo";
import BookingSpaceInfo from "./BookingSpaceInfo";
import { Booking } from "@/types/BookingTypes";
import { supabase } from "@/integrations/supabase/client";

interface BookingDetailContentProps {
  booking: Booking | null;
  client: any;
  space: any;
  formatDate: (date: string) => string;
}

const BookingDetailContent = ({ booking, client, space, formatDate }: BookingDetailContentProps) => {
  if (!booking) return null;

  // Process images to ensure they have full URLs
  const processImages = (images: string[] | undefined) => {
    if (!images || !images.length) return [];
    
    return images.map(img => {
      if (img.startsWith('http')) return img;
      const { data } = supabase.storage.from('spaces').getPublicUrl(img);
      return data.publicUrl;
    });
  };
  
  // Ensure space has processed images
  const processedSpace = space ? {
    ...space,
    processedImages: processImages(space.images)
  } : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BookingMainInfo booking={booking} formatDate={formatDate} />
      <Card className="md:col-span-2">
        <BookingClientInfo client={client} booking={booking} />
        <BookingSpaceInfo space={processedSpace} />
      </Card>
    </div>
  );
};

export default BookingDetailContent;
