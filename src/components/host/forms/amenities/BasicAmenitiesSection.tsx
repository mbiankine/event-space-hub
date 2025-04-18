
import { Button } from "@/components/ui/button";
import { amenitiesOptions } from './amenitiesData';

interface BasicAmenitiesSectionProps {
  selectedAmenities: string[];
  onToggle: (amenityId: string) => void;
}

export function BasicAmenitiesSection({ 
  selectedAmenities, 
  onToggle 
}: BasicAmenitiesSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Comodidades básicas</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {amenitiesOptions.map((amenity) => {
          const Icon = amenity.icon;
          return (
            <Button
              key={amenity.id}
              type="button"
              variant={selectedAmenities.includes(amenity.id) ? "default" : "outline"}
              onClick={() => onToggle(amenity.id)}
              className="justify-start"
            >
              {selectedAmenities.includes(amenity.id) ? (
                <span className="mr-2">✓</span>
              ) : null}
              <Icon className="h-4 w-4 mr-2" />
              {amenity.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

