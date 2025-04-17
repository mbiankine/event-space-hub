
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

type UserRole = 'client' | 'host' | 'admin';

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  bio: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  accountType: UserRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string, accountType: UserRole) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, accountType?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
            fetchUserRoles(currentSession.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setRoles([]);
          setAccountType(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
        fetchUserRoles(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;
      
      const userRoles = data.map(item => item.role as UserRole);
      setRoles(userRoles);
      
      // Set the primary account type based on roles
      if (userRoles.includes('host')) {
        setAccountType('host');
      } else if (userRoles.includes('client')) {
        setAccountType('client');
      } else if (userRoles.includes('admin')) {
        setAccountType('admin');
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const signIn = async (email: string, password: string, accountType: UserRole) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // After sign in, check if the user has the requested account type
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);
        
      if (roleError) throw roleError;
      
      const userRoles = roleData.map(item => item.role);
      if (!userRoles.includes(accountType)) {
        // If the user doesn't have the requested account type, sign out and throw an error
        await supabase.auth.signOut();
        throw new Error(`Esta conta não está registrada como ${accountType === 'client' ? 'Cliente' : 'Anfitrião'}`);
      }
      
      setAccountType(accountType);
      
      // Redirect based on account type
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            account_type: accountType, // Store account type in user metadata
          },
        },
      });
      
      if (error) throw error;

      // If the signup was successful and we have a user, add the account type role
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([
            { user_id: data.user.id, role: accountType }
          ]);
          
        if (roleError) throw roleError;
      }
      
      toast.success(`Conta criada com sucesso! Verifique seu email para confirmação.`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      console.error('Error signing up:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
