
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { BookingConfirmationView } from './booking/BookingConfirmationView';
import { BookingConfirmationForm } from './booking/BookingConfirmationForm';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<{ success: boolean; bookingId?: string }>;
  onProceedToPayment: () => void;
  form: any;
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
  const { user, profile } = useAuth();
  
  useEffect(() => {
    if (isOpen && user && profile && !bookingConfirmed) {
      form.setValue('name', profile.full_name || '');
      form.setValue('email', user.email || '');
      if (profile.phone) {
        form.setValue('phone', profile.phone);
      }
    }
  }, [isOpen, user, profile, form, bookingConfirmed]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {bookingConfirmed 
              ? 'Confirme sua reserva e prossiga para pagamento'
              : 'Complete os dados da sua reserva'}
          </DialogTitle>
          <DialogDescription>
            {bookingConfirmed
              ? 'Confirme os detalhes da sua reserva antes de prosseguir para o pagamento.'
              : 'Preencha os campos abaixo para finalizar sua reserva.'}
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
          <BookingConfirmationForm
            form={form}
            watch={watch}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            space={space}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
