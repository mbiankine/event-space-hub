import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { AuthContextType, UserProfile, UserRole } from './types';
import { fetchUserProfile, fetchUserRoles } from './authHooks';
import * as authService from './authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [accountType, setAccountType] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id).then(profile => {
              console.log('Fetched profile', profile);
              setProfile(profile);
            });
            fetchUserRoles(currentSession.user.id).then(({ roles, primaryRole }) => {
              console.log('Fetched roles', roles, primaryRole);
              setRoles(roles);
              setAccountType(primaryRole);
            });
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setRoles([]);
          setAccountType(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).then(profile => {
          console.log('Initial profile fetch', profile);
          setProfile(profile);
        });
        fetchUserRoles(currentSession.user.id).then(({ roles, primaryRole }) => {
          console.log('Initial roles fetch', roles, primaryRole);
          setRoles(roles);
          setAccountType(primaryRole);
        });
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, accountType: UserRole) => {
    try {
      setIsLoading(true);
      const { success, error } = await authService.signIn(email, password, accountType);
      
      if (!success) throw error;
      
      setAccountType(accountType);
      
      if (accountType === 'host') {
        navigate('/host/dashboard');
      } else {
        navigate('/client/dashboard');
      }
      
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, accountType: UserRole = 'client') => {
    try {
      setIsLoading(true);
      const { success, error } = await authService.signUp(email, password, fullName, accountType);
      
      if (!success) throw error;
      
      toast.success(`Conta criada com sucesso! Verifique seu email para confirmação.`);
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      console.error('Error signing up:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { success, error } = await authService.signOut();
      
      if (!success) throw error;
      
      setAccountType(null);
      navigate('/');
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: UserRole) => {
    return roles.includes(role);
  };

  const value = {
    user,
    session,
    profile,
    roles,
    accountType,
    isLoading,
    signIn,
    signUp,
    signOut,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
