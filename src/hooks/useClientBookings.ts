
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientBooking } from '@/components/client/ClientBookingsList';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export const useClientBookings = (user: User | null) => {
  const [currentBookings, setCurrentBookings] = useState<ClientBooking[]>([]);
  const [pastBookings, setPastBookings] = useState<ClientBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchBookings = async () => {
      if (!user) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching bookings for user ID:", user.id);
        
        const today = new Date().toISOString().split('T')[0];
        
        // Get current bookings
        const { data: currentBookingsData, error: currentError } = await supabase
          .from('bookings')
          .select(`
            *,
            spaces (
              title,
              images,
              location,
              host_id
            )
          `)
          .eq('client_id', user.id)
          .gte('booking_date', today)
          .order('booking_date', { ascending: true });
        
        if (currentError) throw currentError;
        
        // Format current bookings
        const formattedCurrentBookings = currentBookingsData.map((booking) => ({
          ...booking,
          space_title: booking.spaces?.title || booking.space_title,
          images: booking.spaces?.images,
          location: booking.spaces?.location,
          host_id: booking.spaces?.host_id || booking.host_id
        }));
        
        // Get past bookings
        const { data: pastBookingsData, error: pastError } = await supabase
          .from('bookings')
          .select(`
            *,
            spaces (
              title,
              images,
              location,
              host_id
            )
          `)
          .eq('client_id', user.id)
          .lt('booking_date', today)
          .order('booking_date', { ascending: false });
          
        if (pastError) throw pastError;
        
        // Format past bookings
        const pastBookingsFormatted = pastBookingsData.map((booking) => ({
          ...booking,
          space_title: booking.spaces?.title || booking.space_title,
          images: booking.spaces?.images,
          location: booking.spaces?.location,
          host_id: booking.spaces?.host_id || booking.host_id
        }));
        
        if (isMounted) {
          setCurrentBookings(formattedCurrentBookings);
          setPastBookings(pastBookingsFormatted);
          console.log("Fetched bookings:", {
            current: formattedCurrentBookings.length || 0,
            past: pastBookingsFormatted.length || 0
          });
        }
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        if (isMounted) {
          setError(error.message);
          toast.error('Erro ao carregar suas reservas. Tente novamente.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchBookings();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  return { currentBookings, pastBookings, isLoading, error };
};
