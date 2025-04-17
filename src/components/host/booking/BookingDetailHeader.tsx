
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Booking } from "@/types/BookingTypes";

interface BookingDetailHeaderProps {
  booking: Booking | null;
}

const BookingDetailHeader = ({ booking }: BookingDetailHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <Button variant="outline" size="sm" className="mb-4" asChild>
          <Link to="/host/bookings">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para reservas
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">Detalhes da Reserva</h1>
        <p className="text-muted-foreground">{booking?.space_title || "Espaço reservado"}</p>
      </div>
    </div>
  );
};

export default BookingDetailHeader;
