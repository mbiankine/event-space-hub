
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/BookingTypes';
import { toast } from 'sonner';

export const useBookingDetails = (id: string | undefined, user: any) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookingDetails = async () => {
    if (!id || !user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          spaces (
            title,
            images,
            location,
            capacity,
            host_id
          )
        `)
        .eq('id', id)
        .eq('client_id', user.id)
        .single();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error('Reserva não encontrada');
      }
      
      if (data.payment_status === 'paid' && data.status === 'pending') {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', data.id);
        
        if (updateError) {
          console.error('Error updating booking status:', updateError);
        } else {
          data.status = 'confirmed';
        }
      }
      
      setBooking({
        ...data,
        space_title: data.spaces?.title || data.space_title,
        images: data.spaces?.images,
        location: data.spaces?.location,
        host_id: data.spaces?.host_id || data.host_id
      });
      
    } catch (error: any) {
      console.error('Error fetching booking details:', error);
      setError(error.message || 'Erro ao carregar detalhes da reserva');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookingDetails();
    toast.info('Atualizando informações da reserva...');
  };

  useEffect(() => {
    fetchBookingDetails();
    
    const channel = supabase
      .channel('booking-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${id}`
      }, () => {
        fetchBookingDetails();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  return { booking, isLoading, isRefreshing, error, handleRefresh };
};
