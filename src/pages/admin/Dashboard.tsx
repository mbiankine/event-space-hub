
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import DashboardHeader from "@/components/admin/DashboardHeader";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardTabs from "@/components/admin/DashboardTabs";
import QuickActions from "@/components/admin/QuickActions";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const { stats, users, spaces, bookings, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados do dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <DashboardHeader />
        <DashboardStats 
          totalUsers={stats.totalUsers}
          totalSpaces={stats.totalSpaces}
          totalBookings={stats.totalBookings}
          totalRevenue={stats.totalRevenue}
        />
        <DashboardTabs 
          users={users}
          spaces={spaces}
          bookings={bookings}
        />
        <QuickActions />
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
