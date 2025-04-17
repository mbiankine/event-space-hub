
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
    
    console.log("Sign in successful for user:", data.user.id);
    
    // After successful authentication, we'll handle role checks in the AuthContext
    // This avoids the recursive policy error we were seeing
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
): Promise<{ success: boolean; error?: Error, userId?: string }> {
  try {
    console.log(`Attempting to sign up with email: ${email} as ${accountType}, fullName: ${fullName}`);
    
    // First check if the user already exists but might be trying to create a new account type
    const { data: userCheck } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    }).catch(() => ({ data: null }));
    
    if (userCheck?.user) {
      console.log("User already exists with this email");
      return { 
        success: false, 
        error: new Error('Este email já está cadastrado. Por favor faça login ou use outro email.') 
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          account_type: accountType,
        },
      },
    });
    
    if (error) {
      console.error("Supabase signup error:", error);
      throw error;
    }

    console.log("Sign up response:", data);
    
    if (data.user) {
      // Store account type in user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { account_type: accountType }
      });
      
      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }
      
      // Don't try to insert into user_roles table here as it causes recursion errors
      // Instead, use the trigger in the database to handle this
      
      // Sign out after registration to prepare for login
      await supabase.auth.signOut();
      
      return { success: true, userId: data.user.id };
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

// Helper function to get user's role without using the user_roles table
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error("Error getting user:", error);
      return null;
    }
    
    // Get role from user metadata
    const accountType = data.user.user_metadata.account_type as UserRole;
    console.log("Retrieved account type from metadata:", accountType);
    
    return accountType || 'client'; // default to client if not found
  } catch (error) {
    console.error("Error determining user role:", error);
    return null;
  }
}
