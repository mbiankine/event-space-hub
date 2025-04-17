
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientBooking } from '@/components/client/ClientBookingsList';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export const useClientBookings = (user: User | null) => {
  const [currentBookings, setCurrentBookings] = useState<ClientBooking[]>([]);
  const [pastBookings, setPastBookings] = useState<ClientBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching bookings for user ID:", user.id);
        
        const today = new Date().toISOString().split('T')[0];
        
        // Try to get active bookings from view first
        const { data: activeBookings, error: activeError } = await supabase
          .from('active_bookings')
          .select('*')
          .eq('client_id', user.id)
          .gte('booking_date', today)
          .order('booking_date', { ascending: true });
          
        if (activeError) {
          console.error("Error fetching from active_bookings view:", activeError);
          // Fallback to direct bookings query
          const { data: directBookings, error: directError } = await supabase
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
          
          if (directError) throw directError;
          
          const formattedBookings = directBookings.map((booking) => ({
            ...booking,
            space_title: booking.spaces?.title || booking.space_title,
            images: booking.spaces?.images,
            location: booking.spaces?.location,
            host_id: booking.spaces?.host_id || booking.host_id
          }));
          
          setCurrentBookings(formattedBookings || []);
        } else {
          setCurrentBookings(activeBookings || []);
        }
        
        // Fetch past bookings
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
        
        const pastBookingsFormatted = pastBookingsData.map((booking) => ({
          ...booking,
          space_title: booking.spaces?.title || booking.space_title,
          images: booking.spaces?.images,
          location: booking.spaces?.location,
          host_id: booking.spaces?.host_id || booking.host_id
        }));
        
        setPastBookings(pastBookingsFormatted || []);
        console.log("Fetched bookings:", {
          current: activeBookings?.length || 0,
          past: pastBookingsFormatted?.length || 0
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Erro ao carregar suas reservas. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);

  return { currentBookings, pastBookings, isLoading };
};
