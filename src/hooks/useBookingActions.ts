
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/AuthContext";
import { BookingFormValues } from './useBookingForm';

export const useBookingActions = (space: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const { user } = useAuth();

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
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          space_id: space.id,
          client_id: user.id,
          host_id: space.host_id,
          booking_date: values.date.toISOString().split('T')[0],
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

  return {
    isSubmitting,
    bookingConfirmed,
    confirmedBookingId,
    onSubmit,
    calculateTotalPrice
  };
};
