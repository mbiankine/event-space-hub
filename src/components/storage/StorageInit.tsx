
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
          // Create the spaces bucket
          const { data, error } = await supabase
            .storage
            .createBucket('spaces', { 
              public: true,  // Make bucket public
              fileSizeLimit: 10485760  // 10MB limit
            });
          
          if (error) {
            console.error('Error creating spaces bucket:', error);
          } else {
            console.log('Spaces bucket created successfully:', data);
          }
        }
      } catch (error) {
        console.error('Storage initialization error:', error);
      }
    };

    initializeStorage();
  }, []);

  return null;  // This component doesn't render anything
};
