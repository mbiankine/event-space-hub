import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useStripeConfig } from "@/hooks/useStripeConfig";
import { useAuth } from '@/contexts/AuthContext';

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

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const useSpaceBooking = (space: any, navigate: (path: string) => void) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { startStripeCheckout } = useStripeConfig();
  
  const [bookingValues, setBookingValues] = useState({
    date: new Date(),
    guests: 25,
    hours: 4,
    days: 1,
    bookingType: "hourly" as "hourly" | "daily"
  });
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: profile?.full_name || "",
      email: user?.email || "",
      phone: "",
      guests: bookingValues.guests,
      date: bookingValues.date,
      hours: bookingValues.hours,
      days: bookingValues.days,
      eventType: "",
      notes: "",
      bookingType: bookingValues.bookingType,
    },
  });

  const handleBookNow = async (bookingDetails?: {
    date?: Date,
    guests?: number,
    selectedHours?: number,
    selectedDays?: number,
    bookingType?: "hourly" | "daily"
  }) => {
    if (bookingDetails) {
      const newValues = {
        date: bookingDetails.date || bookingValues.date,
        guests: bookingDetails.guests || bookingValues.guests,
        hours: bookingDetails.selectedHours || bookingValues.hours,
        days: bookingDetails.selectedDays || bookingValues.days,
        bookingType: bookingDetails.bookingType || bookingValues.bookingType
      };
      
      setBookingValues(newValues);
      
      form.setValue("guests", newValues.guests);
      form.setValue("date", newValues.date);
      form.setValue("hours", newValues.hours);
      if (newValues.days) form.setValue("days", newValues.days);
      form.setValue("bookingType", newValues.bookingType);
    }
    
    if (!user) {
      setIsAuthModalOpen(true);
      localStorage.setItem('pendingBookingSpace', JSON.stringify({
        spaceId: space.id,
        date: bookingValues.date?.toISOString(),
        guests: bookingValues.guests,
        bookingType: bookingValues.bookingType,
        selectedHours: bookingValues.hours,
        selectedDays: bookingValues.days
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

  const calculateTotalPrice = (values: BookingFormValues) => {
    if (values.bookingType === 'hourly') {
      return (space.hourly_price || 0) * values.hours;
    } else {
      return space.price * (values.days || 1);
    }
  };

  const onSubmit = async (values: BookingFormValues) => {
    if (!space || !user) return { success: false };

    setIsSubmitting(true);
    try {
      const totalPrice = calculateTotalPrice(values);
      
      console.log("Creating booking with total price:", totalPrice);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          space_id: space.id,
          client_id: user.id,
          host_id: space.host_id,
          booking_date: values.date ? values.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          start_time: '10:00',
          end_time: values.bookingType === 'hourly' ? 
            new Date(new Date().setHours(10 + values.hours, 0, 0, 0)).toTimeString().slice(0, 5) : 
            undefined,
          guest_count: values.guests,
          event_type: values.eventType,
          notes: values.notes,
          client_name: values.name,
          client_email: values.email,
          client_phone: values.phone,
          space_title: space.title,
          space_price: totalPrice,
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
    
    const formValues = form.getValues();
    let price = 0;
    let days;
    
    if (formValues.bookingType === 'hourly') {
      price = (space.hourly_price || 0) * formValues.hours;
    } else {
      price = space.price * (formValues.days || 1);
      days = formValues.days;
    }
    
    console.log("Proceeding to payment with calculated price:", price);
    
    await startStripeCheckout(space.id, price, days, confirmedBookingId);
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
    handleProceedToPayment,
    bookingValues
  };
};
