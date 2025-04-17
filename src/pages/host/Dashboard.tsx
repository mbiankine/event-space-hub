
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/host/DashboardStats";
import { QuickMenu } from "@/components/host/QuickMenu";
import { DashboardTabs } from "@/components/host/DashboardTabs";

const HostDashboard = () => {
  const { profile } = useAuth();
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
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch spaces
        const { data: spacesData } = await supabase
          .from('spaces')
          .select('*')
          .limit(3) as {data: any[]};
          
        setSpaces(spacesData || []);
        
        // Calculate stats (In a real app, these would come from the database)
        setStats({
          totalSpaces: spacesData?.length || 0,
          totalBookings: 8,
          totalRevenue: 12500,
          averageRating: 4.9
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

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
          <DashboardTabs spaces={spaces} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostDashboard;
