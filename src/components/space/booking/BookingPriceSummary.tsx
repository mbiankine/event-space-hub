
import { Separator } from "@/components/ui/separator";

interface BookingPriceSummaryProps {
  bookingType: "hourly" | "daily";
  price: number;
  hourlyPrice: number | undefined;
  selectedHours: number;
  selectedDays: number;
  totalPrice: number;
}

export const BookingPriceSummary = ({
  bookingType,
  price,
  hourlyPrice,
  selectedHours,
  selectedDays,
  totalPrice
}: BookingPriceSummaryProps) => {
  return (
    <>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>
            {bookingType === 'hourly' 
              ? `R$ ${hourlyPrice} x ${selectedHours} horas`
              : `R$ ${price} x ${selectedDays} ${selectedDays > 1 ? 'dias' : 'dia'}`}
          </span>
          <span>R$ {totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>R$ {totalPrice.toFixed(2)}</span>
      </div>
    </>
  );
};
