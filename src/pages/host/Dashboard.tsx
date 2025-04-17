
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Space } from '@/types/SpaceTypes';
import { Booking } from '@/types/BookingTypes';
import { QuickMenu } from '@/components/host/QuickMenu';
import { DashboardTabs } from '@/components/host/DashboardTabs';
import { DashboardStats } from '@/components/host/DashboardStats';
import { toast } from 'sonner';

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard do Anfitrião</h1>
        
        <DashboardStats stats={mockStats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <QuickMenu />
          <DashboardTabs 
            spaces={spaces.slice(0, 3)} 
            bookings={bookings.slice(0, 5)}
            isLoading={isLoading} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostDashboard;
