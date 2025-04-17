
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserRole } from '@/contexts/auth/types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, accountType, roles, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole) {
    // Anfitrião pode acessar as rotas de cliente
    if (requiredRole === 'client' && roles.includes('host')) {
      // Permitir acesso se o anfitrião tentar acessar a área do cliente
      return <Outlet />;
    } 
    
    // Verificar o papel do usuário normalmente
    if (!roles.includes(requiredRole)) {
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
  }

  return <Outlet />;
};
