import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface BookingHeaderProps {
  title: string;
  images?: string[];
}

const BookingHeader = ({ title, images }: BookingHeaderProps) => {
  // Function to process image URLs
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise get from storage
    const { data } = supabase.storage.from('spaces').getPublicUrl(imagePath);
    return data.publicUrl;
  };
  
  return (
    <>
      <div className="aspect-video overflow-hidden">
        {images && images.length > 0 ? (
          <img 
            src={getImageUrl(images[0])} 
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", images[0]);
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sem imagem disponível</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </>
  );
};

export default BookingHeader;
