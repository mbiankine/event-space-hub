import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingState } from "@/components/host/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

import { SpaceHeader } from "@/components/space/SpaceHeader";
import { SpaceGallery } from "@/components/space/SpaceGallery";
import { SpaceAmenities } from "@/components/space/SpaceAmenities";
import { BookingCard } from "@/components/space/BookingCard";
import { AuthDialog } from "@/components/space/AuthDialog";
import { BookingFormModal } from "@/components/space/BookingFormModal";
import { useStripeConfig } from "@/hooks/useStripeConfig";

const bookingFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  guests: z.number().min(1, { message: "Mínimo 1 convidado" }).max(1000, { message: "Máximo 1000 convidados" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  hours: z.number().min(1, { message: "Mínimo 1 hora" }).max(24, { message: "Máximo 24 horas" }),
  eventType: z.string().min(1, { message: "Tipo de evento é obrigatório" }),
  notes: z.string().optional(),
  bookingType: z.enum(["hourly", "daily"]),
  days: z.number().min(1, { message: "Mínimo 1 dia" }).max(30, { message: "Máximo 30 dias" }).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const SpaceDetail = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [space, setSpace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHours, setSelectedHours] = useState(4);
  const [selectedDays, setSelectedDays] = useState(1);
  const [bookingType, setBookingType] = useState<"hourly" | "daily">("hourly");
  const [guests, setGuests] = useState(25);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const { startStripeCheckout, isLoading: isStripeLoading } = useStripeConfig();
  
  useEffect(() => {
    const pendingBooking = localStorage.getItem('pendingBookingSpace');
    if (pendingBooking && user) {
      try {
        const bookingData = JSON.parse(pendingBooking);
        if (bookingData.spaceId === id) {
          if (bookingData.date) setDate(new Date(bookingData.date));
          if (bookingData.guests) setGuests(bookingData.guests);
          if (bookingData.bookingType) setBookingType(bookingData.bookingType);
          if (bookingData.selectedHours) setSelectedHours(bookingData.selectedHours);
          if (bookingData.selectedDays) setSelectedDays(bookingData.selectedDays);
          setTimeout(() => {
            handleBookNow();
          }, 500);
        }
        localStorage.removeItem('pendingBookingSpace');
      } catch (error) {
        console.error("Error parsing saved booking data:", error);
        localStorage.removeItem('pendingBookingSpace');
      }
    }
  }, [id, user]);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: profile?.full_name || "",
      email: user?.email || "",
      phone: "",
      guests: 25,
      date: new Date(),
      hours: 4,
      days: 1,
      eventType: "",
      notes: "",
      bookingType: "hourly",
    },
  });
  
  useEffect(() => {
    if (user && profile) {
      form.setValue('name', profile.full_name || '');
      form.setValue('email', user.email || '');
    }
  }, [user, profile, form]);
  
  useEffect(() => {
    const fetchSpace = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setSpace(data);
        
        if (data.availability && data.availability.length > 0) {
          const availableDatesArray = data.availability.map((dateStr: string) => new Date(dateStr));
          setAvailableDates(availableDatesArray);
        }
        
        await loadBookings(data.id);
      } catch (error) {
        console.error('Error fetching space:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpace();
  }, [id, navigate]);
  
  const loadBookings = async (spaceId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_date')
        .eq('space_id', spaceId)
        .eq('status', 'confirmed');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const dates = data.map(booking => new Date(booking.booking_date));
        setUnavailableDates(dates);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const getImageUrls = (space: any) => {
    if (!space || !space.images) return [];
    
    return space.images.map((imagePath: string) => {
      const { data } = supabase.storage
        .from('spaces')
        .getPublicUrl(imagePath);
      return data.publicUrl;
    });
  };
  
  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (availableDates.length > 0) {
      return availableDates.some(availableDate => 
        format(availableDate, 'yyyy-MM-dd') === dateStr
      );
    }
    
    return !unavailableDates.some(unavailableDate => 
      format(unavailableDate, 'yyyy-MM-dd') === dateStr
    );
  };
  
  const handleBookNow = async (): Promise<{ success: boolean }> => {
    if (!user) {
      setIsAuthModalOpen(true);
      
      localStorage.setItem('pendingBookingSpace', JSON.stringify({
        spaceId: id,
        date: date?.toISOString(),
        guests,
        bookingType,
        selectedHours,
        selectedDays
      }));
      
      return { success: false };
    }
    
    return proceedWithBooking();
  };
  
  const proceedWithBooking = async (): Promise<{ success: boolean }> => {
    if (!user || !space) {
      return { success: false };
    }
    
    try {
      form.setValue('date', date || new Date());
      form.setValue('guests', guests);
      form.setValue('hours', selectedHours);
      form.setValue('days', selectedDays);
      form.setValue('email', user.email || '');
      form.setValue('name', profile?.full_name || '');
      form.setValue('bookingType', bookingType);
      
      setIsAuthModalOpen(false);
      setBookingConfirmed(false);
      setIsBookingModalOpen(true);
      
      return { success: true };
    } catch (error) {
      console.error("Error proceeding with booking:", error);
      return { success: false };
    }
  };
  
  const redirectToLogin = () => {
    localStorage.setItem('pendingBookingSpace', JSON.stringify({
      spaceId: id,
      date: date?.toISOString(),
      guests,
      bookingType,
      selectedHours,
      selectedDays
    }));
    
    setIsAuthModalOpen(false);
    
    navigate(`/auth/login?returnUrl=${encodeURIComponent(location.pathname)}`);
  };
  
  const redirectToRegister = () => {
    localStorage.setItem('pendingBookingSpace', JSON.stringify({
      spaceId: id,
      date: date?.toISOString(),
      guests,
      bookingType,
      selectedHours,
      selectedDays
    }));
    
    setIsAuthModalOpen(false);
    
    navigate(`/auth/register?returnUrl=${encodeURIComponent(location.pathname)}`);
  };
  
  const onSubmit = async (values: BookingFormValues) => {
    if (!space || !user) return { success: false };
    
    setIsSubmitting(true);
    try {
      let basePrice = 0;
      
      if (values.bookingType === 'hourly') {
        basePrice = (space.hourly_price || 0) * values.hours;
      } else {
        basePrice = space.price * (values.days || 1);
      }
      
      const totalPrice = basePrice;
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          space_id: space.id,
          client_id: user.id,
          host_id: space.host_id,
          booking_date: format(values.date, 'yyyy-MM-dd'),
          start_time: '10:00',
          end_time: values.bookingType === 'hourly' ? 
            format(new Date(new Date().setHours(10 + values.hours, 0, 0, 0)), 'HH:mm') : 
            undefined,
          guest_count: values.guests,
          event_type: values.eventType,
          notes: values.notes,
          client_name: values.name,
          client_email: values.email,
          client_phone: values.phone,
          space_title: space.title,
          space_price: basePrice,
          service_fee: 0,
          total_price: totalPrice,
          status: 'pending',
          payment_status: 'pending'
        })
        .select();
      
      if (error) throw error;
      
      setBookingConfirmed(true);
      setConfirmedBookingId(data[0].id);
      
      toast.success("Pré-reserva criada com sucesso!", {
        description: "Confirme os detalhes para prosseguir para o pagamento."
      });
      
      return { success: true, bookingId: data[0].id };
      
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error("Erro ao fazer reserva", {
        description: error.message || "Não foi possível processar sua reserva. Tente novamente."
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleProceedToPayment = async () => {
    if (!confirmedBookingId || !space) return;
    
    let price = 0;
    let days;
    
    if (bookingType === 'hourly') {
      price = (space.hourly_price || 0) * selectedHours;
    } else {
      price = space.price * selectedDays;
      days = selectedDays;
    }
    
    await startStripeCheckout(space.id, price, days);
  };
  
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    if (!bookingConfirmed) {
      setBookingConfirmed(false);
      setConfirmedBookingId(null);
    }
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
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Espaço inteiro hospedado por Anfitrião</h2>
                <p className="text-muted-foreground">
                  Até {space.capacity} pessoas
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Sobre o espaço</h3>
              <p className="text-muted-foreground">{space.description}</p>
            </div>
            
            <Separator className="my-6" />
            
            <SpaceAmenities amenities={space.amenities || []} />
          </div>
          
          <div>
            <BookingCard 
              space={space}
              date={date}
              setDate={setDate}
              guests={guests}
              setGuests={setGuests}
              selectedHours={selectedHours}
              setSelectedHours={setSelectedHours}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              bookingType={bookingType}
              setBookingType={setBookingType}
              isDateAvailable={isDateAvailable}
              handleBookNow={handleBookNow}
            />
          </div>
        </div>
        
        <AuthDialog 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen}
          onLogin={redirectToLogin}
          onRegister={redirectToRegister}
        />
        
        <BookingFormModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          onSubmit={onSubmit}
          onProceedToPayment={handleProceedToPayment}
          form={form}
          space={space}
          isSubmitting={isSubmitting}
          isDateAvailable={isDateAvailable}
          bookingConfirmed={bookingConfirmed}
          isProcessingPayment={isStripeLoading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default SpaceDetail;
