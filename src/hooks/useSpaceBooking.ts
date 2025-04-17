
import { useState } from 'react';
import { useBookingForm } from './useBookingForm';
import { useBookingActions } from './useBookingActions';
import { useStripeConfig } from './useStripeConfig';
import { useAuth } from '@/contexts/AuthContext';

export const useSpaceBooking = (space: any, navigate: (path: string) => void) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const form = useBookingForm();
  const { isSubmitting, bookingConfirmed, setBookingConfirmed, confirmedBookingId, onSubmit } = useBookingActions(space);
  const { startStripeCheckout } = useStripeConfig();

  const handleBookNow = async (bookingDetails?: {
    date?: Date;
    guests?: number;
    selectedHours?: number;
    selectedDays?: number;
    bookingType?: "hourly" | "daily";
  }) => {
    if (bookingDetails) {
      form.setValue("date", bookingDetails.date || form.getValues("date"));
      form.setValue("guests", bookingDetails.guests || form.getValues("guests"));
      form.setValue("hours", bookingDetails.selectedHours || form.getValues("hours"));
      form.setValue("days", bookingDetails.selectedDays || form.getValues("days"));
      form.setValue("bookingType", bookingDetails.bookingType || form.getValues("bookingType"));
    }

    if (!user) {
      setIsAuthModalOpen(true);
      localStorage.setItem('pendingBookingSpace', JSON.stringify({
        spaceId: space.id,
        ...bookingDetails
      }));
      return { success: false };
    }
    
    return proceedWithBooking();
  };

  const proceedWithBooking = async () => {
    if (!user || !space) {
      return { success: false };
    }

    setIsAuthModalOpen(false);
    setBookingConfirmed(false);
    setIsBookingModalOpen(true);
    
    return { success: true };
  };

  const handleProceedToPayment = async () => {
    if (!confirmedBookingId || !space) return;
    
    const formValues = form.getValues();
    const totalPrice = formValues.bookingType === 'hourly'
      ? (space.hourly_price || 0) * formValues.hours
      : space.price * (formValues.days || 1);
    
    await startStripeCheckout(
      space.id, 
      totalPrice, 
      formValues.bookingType === 'daily' ? formValues.days : undefined,
      confirmedBookingId
    );
  };

  return {
    form,
    isBookingModalOpen,
    setIsBookingModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isSubmitting,
    bookingConfirmed,
    handleBookNow,
    onSubmit,
    handleProceedToPayment
  };
};
