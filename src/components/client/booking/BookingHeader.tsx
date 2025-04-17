
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface BookingHeaderProps {
  title: string;
  images?: string[];
}

const BookingHeader = ({ title, images }: BookingHeaderProps) => {
  return (
    <>
      <div className="aspect-video overflow-hidden">
        {images && images.length > 0 ? (
          <img 
            src={images[0]} 
            alt={title}
            className="w-full h-full object-cover"
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
