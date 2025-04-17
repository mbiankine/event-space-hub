
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/host/DashboardStats";
import { QuickMenu } from "@/components/host/QuickMenu";
import { DashboardTabs } from "@/components/host/DashboardTabs";
import { toast } from "sonner";

const HostDashboard = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    totalSpaces: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch spaces for this host
        const { data: spacesData, error: spacesError } = await supabase
          .from('spaces')
          .select('*')
          .eq('host_id', user.id);
          
        if (spacesError) throw spacesError;
        setSpaces(spacesData || []);
        
        // Fetch recent bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('host_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
        
        // Calculate stats
        const totalSpacesCount = spacesData?.length || 0;
        const totalBookingsCount = bookingsData?.length || 0;
        
        // Sum up revenue from all bookings
        const revenue = bookingsData?.reduce((total, booking) => 
          total + (booking.total_price || 0), 0) || 0;
          
        // Calculate average rating if available
        let avgRating = 0;
        let ratingCount = 0;
        
        spacesData?.forEach(space => {
          if (space.average_rating) {
            avgRating += space.average_rating;
            ratingCount++;
          }
        });
        
        setStats({
          totalSpaces: totalSpacesCount,
          totalBookings: totalBookingsCount,
          totalRevenue: revenue,
          averageRating: ratingCount > 0 ? (avgRating / ratingCount) : 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erro ao carregar dados do painel');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Olá, {profile?.full_name || 'Anfitrião'}</h1>
            <p className="text-muted-foreground">Gerencie seus espaços e reservas</p>
          </div>
          <Button asChild>
            <Link to="/host/spaces/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar novo espaço
            </Link>
          </Button>
        </div>

        <DashboardStats stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <QuickMenu />
          <DashboardTabs spaces={spaces} bookings={bookings} isLoading={isLoading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostDashboard;
