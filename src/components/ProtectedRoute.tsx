
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserRole } from '@/contexts/auth/types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, accountType, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && accountType !== requiredRole) {
    // Redirect based on their account type
    if (accountType === 'client') {
      return <Navigate to="/client/dashboard" replace />;
    } else if (accountType === 'host') {
      return <Navigate to="/host/dashboard" replace />;
    } else if (accountType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
