
import React from 'react';
import { 
  Wifi, Car, Music, UtensilsCrossed, Lightbulb, Sofa, ShieldCheck, Accessibility 
} from 'lucide-react';

interface SpaceAmenitiesProps {
  amenities: string[];
}

export function SpaceAmenities({ amenities }: SpaceAmenitiesProps) {
  // Helper function to map amenities to icons
  const getAmenityIcon = (amenity: string) => {
    const amenityMap: Record<string, React.ReactNode> = {
      "wifi": <Wifi className="h-5 w-5" />,
      "sound": <Music className="h-5 w-5" />,
      "catering": <UtensilsCrossed className="h-5 w-5" />,
      "parking": <Car className="h-5 w-5" />,
      "furniture": <Sofa className="h-5 w-5" />,
      "lighting": <Lightbulb className="h-5 w-5" />,
      "security": <ShieldCheck className="h-5 w-5" />,
      "accessibility": <Accessibility className="h-5 w-5" />,
    };
    
    return amenityMap[amenity] || <Wifi className="h-5 w-5" />;
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">O que este lugar oferece</h3>
      <div className="grid grid-cols-2 gap-4">
        {amenities && amenities.map((amenity: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            {getAmenityIcon(amenity)}
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
