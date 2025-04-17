
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { BookingConfirmationView } from "./BookingConfirmationView";

export function BookingFormModal({
  isOpen,
  onClose,
  onSubmit,
  onProceedToPayment,
  form,
  space,
  isSubmitting,
  bookingConfirmed,
  isProcessingPayment,
}) {
  const watch = form.watch();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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

        {bookingConfirmed ? (
          <BookingConfirmationView
            watch={watch}
            space={space}
            isProcessingPayment={isProcessingPayment}
            onProceedToPayment={onProceedToPayment}
          />
        ) : (
          <BookingForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
