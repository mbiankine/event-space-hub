
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PricedAmenityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPricedAmenity: {
    name: string;
    price: number;
    description: string;
  };
  onNewPricedAmenityChange: (field: string, value: string | number) => void;
  onAdd: () => void;
}

export function PricedAmenityDialog({
  open,
  onOpenChange,
  newPricedAmenity,
  onNewPricedAmenityChange,
  onAdd
}: PricedAmenityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar comodidade com valor</DialogTitle>
          <DialogDescription>
            Adicione uma comodidade ou serviço com valor adicional que será cobrado junto com a reserva.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="amenity-name">Nome da comodidade</Label>
            <Input
              id="amenity-name"
              placeholder="Ex: DJ"
              value={newPricedAmenity.name}
              onChange={(e) => onNewPricedAmenityChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amenity-price">Valor (R$)</Label>
            <Input
              id="amenity-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={newPricedAmenity.price}
              onChange={(e) => onNewPricedAmenityChange('price', parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amenity-description">Descrição (opcional)</Label>
            <Input
              id="amenity-description"
              placeholder="Descreva detalhes sobre esta comodidade"
              value={newPricedAmenity.description}
              onChange={(e) => onNewPricedAmenityChange('description', e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onAdd}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
