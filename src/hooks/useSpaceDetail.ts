
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { Space } from '@/types/SpaceTypes';

export const useSpaceDetail = (id: string | undefined) => {
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const navigate = useNavigate();

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
          
        if (error) {
          console.error('Error fetching space:', error);
          throw error;
        }
        
        if (!data) {
          console.error('No space data found');
          throw new Error('Space not found');
        }
        
        setSpace(data as Space);
        
        // Processar disponibilidade apenas se existir e tiver comprimento > 0
        if (data.availability && Array.isArray(data.availability) && data.availability.length > 0) {
          const availableDatesArray = data.availability.map((dateStr: string) => new Date(dateStr));
          setAvailableDates(availableDatesArray);
        } else {
          setAvailableDates([]);
        }
        
        // Carregar reservas apenas se tivermos dados do espaço
        await loadBookings(data.id);
      } catch (error) {
        console.error('Error in fetchSpace:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpace();
  }, [id, navigate]);

  const loadBookings = async (spaceId: string) => {
    try {
      console.log('Loading bookings for space ID:', spaceId);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_date, payment_status, status')
        .eq('space_id', spaceId)
        .or('status.eq.confirmed,payment_status.eq.paid');
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Bookings found:', data.length);
        const dates = data
          .filter(booking => booking.payment_status === 'paid' || booking.status === 'confirmed')
          .map(booking => new Date(booking.booking_date));
        
        setUnavailableDates(dates);
      } else {
        console.log('No bookings found');
        setUnavailableDates([]);
      }
    } catch (error) {
      console.error('Error in loadBookings:', error);
    }
  };

  return {
    space,
    isLoading,
    availableDates,
    unavailableDates
  };
};
