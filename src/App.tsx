
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

import AddNewSpace from '@/pages/host/AddNewSpace';
import ManageSpaces from '@/pages/host/ManageSpaces';
import EditSpace from '@/pages/host/EditSpace';
import SpaceCalendar from '@/pages/host/SpaceCalendar';
import HostDashboard from '@/pages/host/Dashboard';
import ClientDashboard from '@/pages/client/Dashboard';
import Index from '@/pages/Index';
import SpaceDetail from '@/pages/SpaceDetail';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ProtectedRoute from '@/components/ProtectedRoute';
import { StorageInit } from '@/components/storage/StorageInit';
import { AuthProvider } from '@/contexts/auth/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <StorageInit />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/spaces/:id" element={<SpaceDetail />} />
          
          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          
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
          
          {/* Catch-all route */}
          <Route path="*" element={<Index />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
