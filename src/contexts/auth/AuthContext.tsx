import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { AuthContextType, UserProfile, UserRole } from './types';
import { fetchUserProfile } from './authHooks';
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
    console.log("Setting up auth state listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => {
            console.log("Fetching user data after sign in");
            fetchUserProfile(currentSession.user.id).then(profile => {
              console.log('Fetched profile', profile);
              setProfile(profile);
            });
            
            // Get role from user metadata instead of roles table
            const userRole = currentSession.user.user_metadata.account_type as UserRole;
            console.log('User role from metadata:', userRole);
            if (userRole) {
              setRoles([userRole]);
              setAccountType(userRole);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing data");
          setProfile(null);
          setRoles([]);
          setAccountType(null);
        }
      }
    );

    console.log("Checking for existing session");
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log("Found existing session, fetching user data");
        fetchUserProfile(currentSession.user.id).then(profile => {
          console.log('Initial profile fetch', profile);
          setProfile(profile);
        });
        
        // Get role from user metadata
        const userRole = currentSession.user.user_metadata.account_type as UserRole;
        console.log('User role from metadata:', userRole);
        if (userRole) {
          setRoles([userRole]);
          setAccountType(userRole);
        }
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
      console.log(`Attempting to sign in as ${accountType}`);
      const { success, error } = await authService.signIn(email, password, accountType);
      
      if (!success) throw error;
      
      // We now get the account type from the user metadata, but still set it here for immediate use
      setAccountType(accountType);
      console.log(`Sign in successful, redirecting to ${accountType} dashboard`);
      
      // Redirect based on account type
      if (accountType === 'admin') {
        navigate('/admin/dashboard');
      } else if (accountType === 'host') {
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
      console.log(`Attempting to sign up as ${accountType}`);
      const { success, error, userId } = await authService.signUp(email, password, fullName, accountType);
      
      if (!success) throw error;
      
      toast.success(`Conta criada com sucesso! Agora você pode fazer login.`);
      navigate('/auth/login'); // Redirect to login page after successful signup
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
