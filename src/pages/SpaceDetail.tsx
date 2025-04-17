
import React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingState } from "@/components/host/LoadingState";
import { SpaceHeader } from "@/components/space/SpaceHeader";
import { SpaceGallery } from "@/components/space/SpaceGallery";
import { SpaceContent } from "@/components/space/SpaceContent";
import { BookingCard } from "@/components/space/BookingCard";
import { AuthDialog } from "@/components/space/AuthDialog";
import { BookingFormModal } from "@/components/space/BookingFormModal";
import { useSpaceDetail } from "@/hooks/useSpaceDetail";
import { useSpaceBooking } from "@/hooks/useSpaceBooking";

const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
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

  return (
    <div className="min-h-screen flex flex-col text-left">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-6">
        <SpaceHeader title={space.title} location={space.location} />
        <SpaceGallery imageUrls={imageUrls} title={space.title} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <SpaceContent 
              space={space}
              onMessageClick={() => setIsBookingModalOpen(true)}
            />
          </div>
          
          <div className="space-y-6">
            <BookingCard 
              space={space}
              unavailableDates={unavailableDates}
              handleBookNow={handleBookNow}
            />
          </div>
        </div>
        
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
          isDateAvailable={date => !unavailableDates.some(d => d.getTime() === date.getTime())}
          bookingConfirmed={bookingConfirmed}
          isProcessingPayment={false}
        />
      </main>
      <Footer />
    </div>
  );
};

export default SpaceDetail;
