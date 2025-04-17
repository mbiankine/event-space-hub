
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from './types';
import { toast } from 'sonner';

export async function signIn(
  email: string, 
  password: string, 
  accountType: UserRole
): Promise<{ success: boolean; error?: Error }> {
  try {
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
