
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const StorageInit = () => {
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Check if the spaces bucket exists
        const { data: buckets, error: listError } = await supabase
          .storage
          .listBuckets();
        
        if (listError) {
          console.error('Error checking storage buckets:', listError);
          return;
        }
        
        const spacesBucketExists = buckets?.some(bucket => bucket.name === 'spaces');
        
        if (!spacesBucketExists) {
          // We'll log that we need admin privileges to create the bucket
          console.log('Spaces bucket does not exist. Admin privileges required to create it.');
          
          // Skip bucket creation attempt for regular users
          if (!supabase.auth.getUser) {
            return;
          }
        }
      } catch (error) {
        // Just log the error but don't show a toast to users
        console.error('Storage initialization error:', error);
      }
    };

    initializeStorage();
  }, []);

  return null;  // This component doesn't render anything
};
