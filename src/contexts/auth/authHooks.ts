
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from './types';

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function fetchUserRoles(userId: string): Promise<{roles: UserRole[], primaryRole: UserRole | null}> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) throw error;
    
    const userRoles = data.map(item => item.role as UserRole);
    
    // Determine primary account type based on roles
    let primaryRole: UserRole | null = null;
    if (userRoles.includes('host')) {
      primaryRole = 'host';
    } else if (userRoles.includes('client')) {
      primaryRole = 'client';
    } else if (userRoles.includes('admin')) {
      primaryRole = 'admin';
    }
    
    return { roles: userRoles, primaryRole };
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return { roles: [], primaryRole: null };
  }
}
