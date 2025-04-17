
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
    // Se o usuário é anfitrião, ele pode acessar as rotas de cliente também
    if (requiredRole === 'client' && roles.includes('host')) {
      // Permitir acesso se o anfitrião tentar acessar a área do cliente
      return <Outlet />;
    } 
    
    // Verificar o papel do usuário normalmente
    if (!roles.includes(requiredRole)) {
      // Redirecionar com base no tipo de conta principal
      const dashboardPath = `/${accountType}/dashboard`;
      return <Navigate to={dashboardPath} replace />;
    }
  }

  return <Outlet />;
};
