
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminStats {
  totalUsers: number;
  totalSpaces: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  account_type: string;
  status: string;
  full_name: string | null;
}

export interface Space {
  id: string;
  title: string;
  host_name: string;
  location: {
    city: string;
    state: string;
  };
  capacity: number;
  price: number;
  status: string;
}

export interface Booking {
  id: string;
  client_name: string;
  space_title: string;
  booking_date: string;
  total_price: number;
  status: string;
}

export function useAdminDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSpaces: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // Fetch total users
        const { count: userCount, error: userCountError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (userCountError) throw userCountError;
        
        // Fetch total spaces
        const { count: spaceCount, error: spaceCountError } = await supabase
          .from('spaces')
          .select('*', { count: 'exact', head: true });
          
        if (spaceCountError) throw spaceCountError;
        
        // Fetch total bookings
        const { count: bookingCount, error: bookingCountError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });
          
        if (bookingCountError) throw bookingCountError;
        
        // Fetch total revenue
        const { data: bookingData, error: bookingDataError } = await supabase
          .from('bookings')
          .select('total_price');
          
        if (bookingDataError) throw bookingDataError;
        
        const totalRevenue = bookingData.reduce((sum, booking) => 
          sum + (booking.total_price || 0), 0);
        
        // Set the stats
        setStats({
          totalUsers: userCount || 0,
          totalSpaces: spaceCount || 0,
          totalBookings: bookingCount || 0,
          totalRevenue: totalRevenue || 0
        });
        
        // Fetch users data
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select(`
            id, 
            full_name, 
            created_at,
            auth.users!profiles_id_fkey (email, raw_user_meta_data)
          `)
          .limit(10);
          
        if (userError) throw userError;
        
        const formattedUsers = userData.map(user => ({
          id: user.id,
          email: user['auth.users'].email,
          created_at: user.created_at,
          account_type: user['auth.users'].raw_user_meta_data?.account_type || 'client',
          status: 'Ativo', // Could be determined by other factors
          full_name: user.full_name
        }));
        
        setUsers(formattedUsers);
        
        // Fetch spaces data
        const { data: spaceData, error: spaceError } = await supabase
          .from('spaces')
          .select(`
            id,
            title,
            capacity,
            price,
            location,
            host_id,
            profiles (full_name)
          `)
          .limit(10);
          
        if (spaceError) throw spaceError;
        
        const formattedSpaces = spaceData.map(space => ({
          id: space.id,
          title: space.title,
          host_name: space.profiles?.full_name || 'Desconhecido',
          location: {
            city: space.location?.city || 'N/A',
            state: space.location?.state || 'N/A'
          },
          capacity: space.capacity,
          price: space.price,
          status: 'Ativo' // Could be determined by other factors
        }));
        
        setSpaces(formattedSpaces);
        
        // Fetch bookings data
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            client_name,
            space_title,
            booking_date,
            total_price,
            status
          `)
          .order('booking_date', { ascending: false })
          .limit(10);
          
        if (bookingsError) throw bookingsError;
        
        setBookings(bookingsData);
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: error.message || 'Falha ao carregar os dados do dashboard',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [toast]);

  return { stats, users, spaces, bookings, isLoading };
}
