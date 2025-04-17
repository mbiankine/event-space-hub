
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

import AddNewSpace from '@/pages/host/AddNewSpace';
import ManageSpaces from '@/pages/host/ManageSpaces';
import EditSpace from '@/pages/host/EditSpace';
import SpaceCalendar from '@/pages/host/SpaceCalendar';
import Bookings from '@/pages/host/Bookings';
import Messages from '@/pages/host/Messages';
import Analytics from '@/pages/host/Analytics';
import Settings from '@/pages/host/Settings';
import HostDashboard from '@/pages/host/Dashboard';
import ClientDashboard from '@/pages/client/Dashboard';
import AdminDashboard from '@/pages/admin/Dashboard';
import StripeConfig from '@/pages/admin/StripeConfig';
import Index from '@/pages/Index';
import SpaceDetail from '@/pages/SpaceDetail';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import AdminLogin from '@/pages/admin/Login';
import ReservationSuccess from '@/pages/ReservationSuccess';
import ProtectedRoute from '@/components/ProtectedRoute';
import { StorageInit } from '@/components/storage/StorageInit';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { ThemeProvider } from '@/contexts/theme/ThemeContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <StorageInit />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/spaces/:id" element={<SpaceDetail />} />
            
            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Admin auth route */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Reservation success route */}
            <Route path="/reservas/sucesso" element={<ReservationSuccess />} />
            
            {/* Protected client routes */}
            <Route 
              path="/client/dashboard" 
              element={<ProtectedRoute requiredRole="client"><ClientDashboard /></ProtectedRoute>} 
            />
            
            {/* Protected host routes */}
            <Route 
              path="/host/dashboard" 
              element={<ProtectedRoute requiredRole="host"><HostDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/host/spaces" 
              element={<ProtectedRoute requiredRole="host"><ManageSpaces /></ProtectedRoute>} 
            />
            <Route 
              path="/host/spaces/new" 
              element={<ProtectedRoute requiredRole="host"><AddNewSpace /></ProtectedRoute>} 
            />
            <Route 
              path="/host/spaces/:id/edit" 
              element={<ProtectedRoute requiredRole="host"><EditSpace /></ProtectedRoute>} 
            />
            <Route 
              path="/host/spaces/:id/calendar" 
              element={<ProtectedRoute requiredRole="host"><SpaceCalendar /></ProtectedRoute>} 
            />
            <Route 
              path="/host/bookings" 
              element={<ProtectedRoute requiredRole="host"><Bookings /></ProtectedRoute>} 
            />
            <Route 
              path="/host/messages" 
              element={<ProtectedRoute requiredRole="host"><Messages /></ProtectedRoute>} 
            />
            <Route 
              path="/host/analytics" 
              element={<ProtectedRoute requiredRole="host"><Analytics /></ProtectedRoute>} 
            />
            <Route 
              path="/host/settings" 
              element={<ProtectedRoute requiredRole="host"><Settings /></ProtectedRoute>} 
            />
            
            {/* Protected admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/stripe" 
              element={<ProtectedRoute requiredRole="admin"><StripeConfig /></ProtectedRoute>} 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Index />} />
          </Routes>
          <Toaster position="top-right" />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
