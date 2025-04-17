
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SpaceDetail from "./pages/SpaceDetail";
import ClientDashboard from "./pages/client/Dashboard";
import HostDashboard from "./pages/host/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Host routes
import AddNewSpace from "./pages/host/AddNewSpace";
import ManageSpaces from "./pages/host/ManageSpaces";
import HostBookings from "./pages/host/Bookings";
import BookingDetail from "./pages/host/BookingDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/spaces/:id" element={<SpaceDetail />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Protected routes for clients */}
            <Route element={<ProtectedRoute requiredRole='client' />}>
              <Route path="/client/dashboard" element={<ClientDashboard />} />
            </Route>
            
            {/* Protected routes for hosts */}
            <Route element={<ProtectedRoute requiredRole='host' />}>
              <Route path="/host/dashboard" element={<HostDashboard />} />
              <Route path="/host/spaces" element={<ManageSpaces />} />
              <Route path="/host/spaces/new" element={<AddNewSpace />} />
              <Route path="/host/bookings" element={<HostBookings />} />
              <Route path="/host/bookings/:id" element={<BookingDetail />} />
            </Route>
            
            {/* Protected routes for admins */}
            <Route element={<ProtectedRoute requiredRole='admin' />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
