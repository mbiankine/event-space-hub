
import { Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomAmenitiesSectionProps {
  customAmenities: string[];
  onAdd: (amenity: string) => void;
  onRemove: (amenity: string) => void;
  newAmenity: string;
  onNewAmenityChange: (value: string) => void;
}

export function CustomAmenitiesSection({ 
  customAmenities, 
  onAdd, 
  onRemove, 
  newAmenity, 
  onNewAmenityChange 
}: CustomAmenitiesSectionProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Adicionar comodidades personalizadas</h4>
      <div className="flex space-x-2 mb-2">
        <Input 
          placeholder="Ex: Mesa de Bilhar" 
          value={newAmenity}
          onChange={(e) => onNewAmenityChange(e.target.value)}
          className="w-full"
        />
        <Button 
          type="button" 
          onClick={() => onAdd(newAmenity)} 
          variant="outline" 
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {customAmenities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {customAmenities.map((amenity, index) => (
            <div 
              key={index} 
              className="bg-secondary text-secondary-foreground py-1 px-3 rounded-full flex items-center text-sm"
            >
              {amenity}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => onRemove(amenity)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
