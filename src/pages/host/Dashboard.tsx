
import React, { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Space } from '@/types/SpaceTypes';
import { Booking } from '@/types/BookingTypes';
import { DashboardStats } from '@/components/host/DashboardStats';
import { DashboardTabs } from '@/components/host/DashboardTabs';
import { toast } from 'sonner';
import { HostLayout } from "@/components/layouts/HostLayout";

const HostDashboard = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const mockStats = {
    totalSpaces: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 4.9,
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch spaces
        const { data: spacesData, error: spacesError } = await supabase
          .from('spaces')
          .select('*')
          .eq('host_id', user.id)
          .order('created_at', { ascending: false }) as { data: Space[], error: any };
          
        if (spacesError) throw spacesError;
        
        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('host_id', user.id)
          .order('booking_date', { ascending: true }) as { data: Booking[], error: any };
          
        if (bookingsError) throw bookingsError;
        
        setSpaces(spacesData || []);
        setBookings(bookingsData || []);
        
        // Update mock stats
        mockStats.totalSpaces = spacesData?.length || 0;
        mockStats.totalBookings = bookingsData?.length || 0;
        // Calculate total revenue from bookings
        mockStats.totalRevenue = bookingsData?.reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0) || 0;
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erro ao carregar os dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  return (
    <HostLayout 
      title="Dashboard do Anfitrião" 
      description="Gerencie seus espaços e reservas"
    >
      <DashboardStats stats={mockStats} />
      <DashboardTabs 
        spaces={spaces.slice(0, 3)} 
        bookings={bookings.slice(0, 5)}
        isLoading={isLoading} 
      />
    </HostLayout>
  );
};

export default HostDashboard;
