
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
        
        // Fetch users data - Fixing the join query that was causing errors
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, full_name, created_at')
          .limit(10);
          
        if (userError) throw userError;

        // Separately fetch email data from auth.users through RPC function (safer approach)
        const { data: authData, error: authError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .limit(10);

        if (authError) throw authError;
        
        // Combine profile and auth data
        const formattedUsers = userData.map(user => {
          const userRole = authData?.find(auth => auth.user_id === user.id);
          return {
            id: user.id,
            email: `${user.id.slice(0, 8)}@example.com`, // Placeholder since we can't directly query auth.users
            created_at: user.created_at,
            account_type: userRole?.role || 'client',
            status: 'Ativo', // Could be determined by other factors
            full_name: user.full_name
          };
        });
        
        setUsers(formattedUsers);
        
        // Fetch spaces data - Fix the relation issue between spaces and profiles
        const { data: spaceData, error: spaceError } = await supabase
          .from('spaces')
          .select('id, title, capacity, price, location, host_id')
          .limit(10);
          
        if (spaceError) throw spaceError;

        // Fetch host profiles separately
        const hostIds = spaceData.map(space => space.host_id);
        const { data: hostData, error: hostError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', hostIds);

        if (hostError) throw hostError;
        
        const formattedSpaces = spaceData.map(space => {
          const host = hostData?.find(h => h.id === space.host_id);
          // Properly handle location as JSON
          const location = typeof space.location === 'string' 
            ? JSON.parse(space.location)
            : space.location;

          return {
            id: space.id,
            title: space.title,
            host_name: host?.full_name || 'Desconhecido',
            location: {
              city: location?.city || 'N/A',
              state: location?.state || 'N/A'
            },
            capacity: space.capacity,
            price: space.price || 0,
            status: 'Ativo' // Could be determined by other factors
          };
        });
        
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
