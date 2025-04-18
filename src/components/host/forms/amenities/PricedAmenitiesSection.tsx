
import { X, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PricedAmenityDialog } from './PricedAmenityDialog';
import { CustomAmenity } from "@/types/SpaceTypes";

interface PricedAmenitiesSectionProps {
  pricedAmenities: any[];
  onRemove: (index: number) => void;
  onAdd: () => void;
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricedAmenitiesSection({
  pricedAmenities,
  onRemove,
  onAdd,
  isDialogOpen,
  onOpenChange
}: PricedAmenitiesSectionProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Comodidades com valores adicionais</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar
        </Button>
      </div>
      
      {pricedAmenities.length > 0 ? (
        <div className="space-y-2">
          {pricedAmenities.map((amenity, index) => (
            <div 
              key={index}
              className="border rounded-md p-3 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{amenity.name}</div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(amenity.price)}
                </div>
                {amenity.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {amenity.description}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Adicione comodidades com valores adicionais que podem ser contratados junto com o espaço.
        </div>
      )}
    </div>
  );
}
