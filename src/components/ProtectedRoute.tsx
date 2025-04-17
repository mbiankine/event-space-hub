
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserRole } from '@/contexts/auth/types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { user, accountType, roles, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (!user) {
    // Store the path the user was trying to access so we can redirect after login
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole) {
    // Special handling for admin role
    if (requiredRole === 'admin' && roles.includes('admin')) {
      return children ? <>{children}</> : <Outlet />;
    }
    
    // Se o usuário é anfitrião, ele pode acessar as rotas de cliente também
    if (requiredRole === 'client' && roles.includes('host')) {
      // Permitir acesso se o anfitrião tentar acessar a área do cliente
      return children ? <>{children}</> : <Outlet />;
    } 
    
    // Verificar o papel do usuário normalmente
    if (!roles.includes(requiredRole)) {
      // Redirecionar com base no tipo de conta principal
      if (accountType) {
        const dashboardPath = `/${accountType}/dashboard`;
        return <Navigate to={dashboardPath} replace />;
      }
      // If no account type is found, redirect to home
      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
