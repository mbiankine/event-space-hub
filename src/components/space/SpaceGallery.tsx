import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SpaceGalleryProps {
  imageUrls: string[];
  title: string;
}

export function SpaceGallery({ imageUrls, title }: SpaceGalleryProps) {
  // Function to get public URL for storage items
  const getPublicUrl = (imagePath: string) => {
    // Check if image is already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Otherwise generate storage URL
    const { data } = supabase.storage
      .from('spaces')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
      {imageUrls && imageUrls.length > 0 ? (
        <>
          <div className="md:col-span-2 row-span-2">
            <img
              src={getPublicUrl(imageUrls[0])}
              alt={title}
              className="w-full h-full object-cover rounded-l-xl"
            />
          </div>
          {imageUrls.slice(1, 5).map((url: string, index: number) => (
            <div key={index}>
              <img
                src={getPublicUrl(url)}
                alt={`${title} ${index + 1}`}
                className={`w-full h-full object-cover ${index === 0 ? 'rounded-tr-xl' : index === 3 ? 'rounded-br-xl' : ''}`}
              />
            </div>
          ))}
        </>
      ) : (
        <div className="md:col-span-4 aspect-video">
          <img
            src="https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop"
            alt={title}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
