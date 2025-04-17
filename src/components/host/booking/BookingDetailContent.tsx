
import { Card } from "@/components/ui/card";
import BookingMainInfo from "./BookingMainInfo";
import BookingClientInfo from "./BookingClientInfo";
import BookingSpaceInfo from "./BookingSpaceInfo";
import { Booking } from "@/types/BookingTypes";

interface BookingDetailContentProps {
  booking: Booking | null;
  client: any;
  space: any;
  formatDate: (date: string) => string;
}

const BookingDetailContent = ({ booking, client, space, formatDate }: BookingDetailContentProps) => {
  if (!booking) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BookingMainInfo booking={booking} formatDate={formatDate} />
      <Card className="md:col-span-2">
        <BookingClientInfo client={client} booking={booking} />
        <BookingSpaceInfo space={space} />
      </Card>
    </div>
  );
};

export default BookingDetailContent;
