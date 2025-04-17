import React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingState } from "@/components/host/LoadingState";
import { SpaceDetailContent } from "@/components/space/SpaceDetailContent";
import { AuthDialog } from "@/components/space/AuthDialog";
import { BookingFormModal } from "@/components/space/BookingFormModal";
import { useSpaceDetail } from "@/hooks/useSpaceDetail";
import { useSpaceBooking } from "@/hooks/useSpaceBooking";
import { useBookingState } from "@/hooks/useBookingState";
import { supabase } from '@/integrations/supabase/client';

const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const bookingState = useBookingState();
  
  const {
    space,
    isLoading,
    availableDates,
    unavailableDates
  } = useSpaceDetail(id);
  
  const {
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
  } = useSpaceBooking(space, navigate);

  const getImageUrls = (space: any) => {
    if (!space || !space.images) return [];
    return space.images.map((imagePath: string) => {
      if (imagePath.startsWith('http')) return imagePath;
      const { data } = supabase.storage.from('spaces').getPublicUrl(imagePath);
      return data.publicUrl;
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-6 flex items-center justify-center">
        <LoadingState />
      </main>
      <Footer />
    </div>
  );

  if (!space) return null;

  const imageUrls = getImageUrls(space);
  
  const handleBookingClick = async () => {
    // Capture current booking state values when booking button is clicked
    const result = await handleBookNow({
      date: bookingState.date,
      guests: bookingState.guests,
      selectedHours: bookingState.selectedHours,
      selectedDays: bookingState.selectedDays,
      bookingType: bookingState.bookingType
    });
    
    return result;
  };
  
  const bookingProps = {
    ...bookingState,
    isDateAvailable: (date: Date) => !unavailableDates.some(d => d.getTime() === date.getTime()),
    handleBookNow: handleBookingClick,
    unavailableDates
  };

  return (
    <div className="min-h-screen flex flex-col text-left">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-6">
        <SpaceDetailContent
          space={space}
          imageUrls={imageUrls}
          bookingProps={bookingProps}
          onMessageClick={() => setIsBookingModalOpen(true)}
        />
        
        <AuthDialog 
          isOpen={isAuthModalOpen}
          onOpenChange={setIsAuthModalOpen}
          onLogin={() => navigate(`/auth/login?returnUrl=${encodeURIComponent(location.pathname)}`)}
          onRegister={() => navigate(`/auth/register?returnUrl=${encodeURIComponent(location.pathname)}`)}
        />
        
        <BookingFormModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            if (!bookingConfirmed) {
              form.reset();
            }
          }}
          onSubmit={onSubmit}
          onProceedToPayment={handleProceedToPayment}
          form={form}
          space={space}
          isSubmitting={isSubmitting}
          isDateAvailable={(date) => !unavailableDates.some(d => d.getTime() === date.getTime())}
          bookingConfirmed={bookingConfirmed}
          isProcessingPayment={false}
        />
      </main>
      <Footer />
    </div>
  );
};

export default SpaceDetail;
