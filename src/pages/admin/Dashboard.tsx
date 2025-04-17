
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import DashboardHeader from "@/components/admin/DashboardHeader";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardTabs from "@/components/admin/DashboardTabs";
import QuickActions from "@/components/admin/QuickActions";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <DashboardHeader />
        <DashboardStats />
        <DashboardTabs />
        <QuickActions />
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
