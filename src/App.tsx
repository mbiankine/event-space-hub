
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

import AddNewSpace from '@/pages/host/AddNewSpace';
import ManageSpaces from '@/pages/host/ManageSpaces';
import Index from '@/pages/Index';
import SpaceDetail from '@/pages/SpaceDetail';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ProtectedRoute from '@/components/ProtectedRoute';
import { StorageInit } from '@/components/storage/StorageInit';

function App() {
  return (
    <Router>
      <StorageInit />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/spaces/:id" element={<SpaceDetail />} />
        
        {/* Auth routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        
        {/* Protected host routes */}
        <Route 
          path="/host/spaces" 
          element={<ProtectedRoute requiredRole="host"><ManageSpaces /></ProtectedRoute>} 
        />
        <Route 
          path="/host/spaces/new" 
          element={<ProtectedRoute requiredRole="host"><AddNewSpace /></ProtectedRoute>} 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Index />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
