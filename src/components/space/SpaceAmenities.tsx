
import React from 'react';
import { 
  Wifi, Car, Music, UtensilsCrossed, Lightbulb, Sofa, ShieldCheck, Accessibility, DollarSign 
} from 'lucide-react';
import { CustomAmenity } from '@/types/SpaceTypes';

interface SpaceAmenitiesProps {
  amenities: string[];
  customAmenities: CustomAmenity[];
}

export function SpaceAmenities({ amenities, customAmenities }: SpaceAmenitiesProps) {
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

  const paidAmenities = customAmenities.filter(amenity => amenity.price > 0);
  const regularCustomAmenities = customAmenities.filter(amenity => !amenity.price);

  return (
    <div className="space-y-6">
      {/* Regular amenities */}
      <div>
        <h3 className="text-lg font-medium mb-4">O que este lugar oferece</h3>
        <div className="grid grid-cols-2 gap-4">
          {amenities.map((amenity: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {regularCustomAmenities.map((amenity, index) => (
            <div key={`custom-${index}`} className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              <span>{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Paid amenities */}
      {paidAmenities.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Serviços adicionais disponíveis</h3>
          <div className="grid grid-cols-1 gap-4">
            {paidAmenities.map((amenity, index) => (
              <div key={`paid-${index}`} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{amenity.name}</h4>
                    {amenity.description && (
                      <p className="text-sm text-muted-foreground mt-1">{amenity.description}</p>
                    )}
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(amenity.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
