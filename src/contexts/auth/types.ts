
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'client' | 'host' | 'admin';

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  bio: string | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  accountType: UserRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string, accountType: UserRole) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, accountType?: UserRole) => Promise<{success: boolean, error?: Error}>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}
