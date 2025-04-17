
import { User } from "@supabase/supabase-js";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Booking } from "@/types/BookingTypes";
import BookingStatusActions from "./BookingStatusActions";

interface BookingDetailActionsProps {
  booking: Booking;
  user: User | null;
  onStatusUpdate: (newStatus: string) => void;
}

const BookingDetailActions = ({ booking, user, onStatusUpdate }: BookingDetailActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensagens
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Conversa com {booking?.client_name || "Cliente"}</SheetTitle>
            <SheetDescription>Envie mensagens sobre esta reserva</SheetDescription>
          </SheetHeader>
          <div className="h-full flex flex-col justify-center items-center">
            <p className="text-muted-foreground">Sistema de mensagens em desenvolvimento.</p>
          </div>
        </SheetContent>
      </Sheet>

      {user && (
        <BookingStatusActions 
          booking={booking} 
          user={user} 
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
};

export default BookingDetailActions;
