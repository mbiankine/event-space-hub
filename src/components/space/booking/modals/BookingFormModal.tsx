
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "../BookingForm";
import { BookingConfirmationView } from "../BookingConfirmationView";
import { BookingFormModalHeader } from "./BookingFormModalHeader";
import { UseFormReturn } from "react-hook-form";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<{ success: boolean; bookingId?: string }>;
  onProceedToPayment: () => void;
  form: UseFormReturn<any>;
  space: any;
  isSubmitting: boolean;
  bookingConfirmed: boolean;
  isProcessingPayment: boolean;
}

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
}: BookingFormModalProps) {
  const watch = form.watch();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <BookingFormModalHeader bookingConfirmed={bookingConfirmed} />

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
