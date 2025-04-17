
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BookingFormModalHeaderProps {
  bookingConfirmed: boolean;
}

export function BookingFormModalHeader({ bookingConfirmed }: BookingFormModalHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {bookingConfirmed 
          ? "Confirme sua reserva e prossiga para pagamento" 
          : "Complete os dados da sua reserva"}
      </DialogTitle>
      <DialogDescription>
        {bookingConfirmed
          ? "Confirme os detalhes da sua reserva antes de prosseguir para o pagamento."
          : "Preencha os campos abaixo para finalizar sua reserva."}
      </DialogDescription>
    </DialogHeader>
  );
}
