
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

export const useSpaceDetail = (id: string | undefined) => {
  const [space, setSpace] = useState<any>(null);
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
          .select('*, custom_amenities')
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
        .select('booking_date, payment_status, status')
        .eq('space_id', spaceId)
        .or('status.eq.confirmed,payment_status.eq.paid');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const dates = data
          .filter(booking => booking.payment_status === 'paid' || booking.status === 'confirmed')
          .map(booking => new Date(booking.booking_date));
        
        setUnavailableDates(dates);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return {
    space,
    isLoading,
    availableDates,
    unavailableDates
  };
};
