
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from './types';
import { toast } from 'sonner';

export async function signIn(
  email: string, 
  password: string, 
  accountType: UserRole
): Promise<{ success: boolean; error?: Error }> {
  try {
    console.log(`Attempting to sign in with email: ${email} as ${accountType}`);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    
    console.log("Sign in successful, checking roles for user:", data.user.id);
    
    // After sign in, check if the user has the requested account type
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id);
      
    if (roleError) throw roleError;
    
    const userRoles = roleData.map(item => item.role);
    console.log("User roles:", userRoles);
    
    // Se o usuário é anfitrião, ele pode entrar como cliente também
    if (accountType === 'client' && !userRoles.includes('client') && userRoles.includes('host')) {
      console.log('Host accessing as client, allowing access');
      return { success: true };
    }
    
    // Se não for o caso acima, verificar se tem a role solicitada
    if (!userRoles.includes(accountType)) {
      // If the user doesn't have the requested account type, sign out and throw an error
      console.log(`User does not have the required role: ${accountType}`);
      await supabase.auth.signOut();
      throw new Error(`Esta conta não está registrada como ${accountType === 'client' ? 'Cliente' : 'Anfitrião'}`);
    }
    
    console.log("Authentication successful with correct role");
    return { success: true };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
}

export async function signUp(
  email: string, 
  password: string, 
  fullName?: string, 
  accountType: UserRole = 'client'
): Promise<{ success: boolean; error?: Error }> {
  try {
    console.log(`Attempting to sign up with email: ${email} as ${accountType}, fullName: ${fullName}`);
    
    // First check if the user already exists but might be trying to create a new account type
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', email);
    
    if (existingUsers && existingUsers.length > 0) {
      console.log("User already exists with this email");
      throw new Error('Este email já está cadastrado. Por favor faça login ou use outro email.');
    }

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
    
    if (error) {
      console.error("Supabase signup error:", error);
      throw error;
    }

    console.log("Sign up response:", data);
    
    // If the signup was successful and we have a user, add the account type role
    if (data.user) {
      console.log(`Adding ${accountType} role for user ${data.user.id}`);
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          { user_id: data.user.id, role: accountType }
        ]);
        
      if (roleError) {
        console.error("Error adding role:", roleError);
        throw roleError;
      }
      
      console.log("Role added successfully, signing out to prepare for login");
      // Sign out after registration to prevent automatic login
      // This ensures a clean state for the next login
      await supabase.auth.signOut();
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
}

export async function signOut(): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
}
