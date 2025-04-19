
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CustomAmenity } from '@/types/SpaceTypes';
import { formatCurrency } from '@/lib/utils';

interface AdditionalAmenitiesSelectorProps {
  amenities: CustomAmenity[];
  selectedAmenities: CustomAmenity[];
  onAmenityToggle: (amenity: CustomAmenity) => void;
  disabled?: boolean;
}

export function AdditionalAmenitiesSelector({
  amenities,
  selectedAmenities,
  onAmenityToggle,
  disabled = false
}: AdditionalAmenitiesSelectorProps) {
  if (!amenities || amenities.length === 0) return null;

  const isSelected = (amenity: CustomAmenity) =>
    selectedAmenities.some(selected => selected.name === amenity.name);

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Serviços adicionais disponíveis</h4>
      <div className="space-y-2">
        {amenities.map((amenity) => (
          <div key={amenity.name} className="flex items-start space-x-3 p-3 border rounded-md">
            <Checkbox
              id={`amenity-${amenity.name}`}
              checked={isSelected(amenity)}
              onCheckedChange={() => onAmenityToggle(amenity)}
              disabled={disabled}
            />
            <div className="flex-1">
              <Label htmlFor={`amenity-${amenity.name}`} className="font-medium">
                {amenity.name}
              </Label>
              {amenity.description && (
                <p className="text-sm text-muted-foreground">{amenity.description}</p>
              )}
              <p className="text-sm font-medium">{formatCurrency(amenity.price || 0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
