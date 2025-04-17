
import { useState } from 'react';
import { Control } from 'react-hook-form';
import { Plus, X, Wifi, Car, Music, UtensilsCrossed, Lightbulb, Sofa, ShieldCheck, Accessibility, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection } from './FormSection';
import { SpaceFormValues } from './types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Amenities options with icons
const amenitiesOptions = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Estacionamento", icon: Car },
  { id: "sound", label: "Sistema de Som", icon: Music },
  { id: "lighting", label: "Iluminação", icon: Lightbulb },
  { id: "catering", label: "Serviço de Buffet", icon: UtensilsCrossed },
  { id: "furniture", label: "Mobiliário", icon: Sofa },
  { id: "security", label: "Segurança", icon: ShieldCheck },
  { id: "accessibility", label: "Acessibilidade", icon: Accessibility },
];

interface AmenitiesSectionProps {
  control: Control<SpaceFormValues>;
  form: any; // Add more specific type if needed
}

export function AmenitiesSection({ control, form }: AmenitiesSectionProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    form.getValues("amenities") || []
  );
  
  const [customAmenities, setCustomAmenities] = useState<string[]>(
    form.getValues("customAmenities") || []
  );
  
  const [pricedAmenities, setPricedAmenities] = useState<any[]>(
    form.getValues("pricedAmenities") || []
  );
  
  const [newAmenity, setNewAmenity] = useState("");
  const [isAddPricedAmenityOpen, setIsAddPricedAmenityOpen] = useState(false);
  const [newPricedAmenity, setNewPricedAmenity] = useState({
    name: "",
    price: 0,
    description: ""
  });

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenityId)) {
        return prev.filter((id) => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
    const currentAmenities = form.getValues("amenities");
    if (currentAmenities.includes(amenityId)) {
      form.setValue(
        "amenities",
        currentAmenities.filter((id: string) => id !== amenityId)
      );
    } else {
      form.setValue("amenities", [...currentAmenities, amenityId]);
    }
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !customAmenities.includes(newAmenity.trim())) {
      const updatedCustomAmenities = [...customAmenities, newAmenity.trim()];
      setCustomAmenities(updatedCustomAmenities);
      form.setValue("customAmenities", updatedCustomAmenities);
      setNewAmenity("");
    }
  };

  const removeCustomAmenity = (amenity: string) => {
    const updatedCustomAmenities = customAmenities.filter(item => item !== amenity);
    setCustomAmenities(updatedCustomAmenities);
    form.setValue("customAmenities", updatedCustomAmenities);
  };

  const addPricedAmenity = () => {
    if (newPricedAmenity.name.trim() && newPricedAmenity.price > 0) {
      const updatedPricedAmenities = [...pricedAmenities, { ...newPricedAmenity }];
      setPricedAmenities(updatedPricedAmenities);
      form.setValue("pricedAmenities", updatedPricedAmenities);
      setNewPricedAmenity({
        name: "",
        price: 0,
        description: ""
      });
      setIsAddPricedAmenityOpen(false);
    }
  };

  const removePricedAmenity = (index: number) => {
    const updatedPricedAmenities = pricedAmenities.filter((_, i) => i !== index);
    setPricedAmenities(updatedPricedAmenities);
    form.setValue("pricedAmenities", updatedPricedAmenities);
  };

  return (
    <FormSection title="Comodidades">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {amenitiesOptions.map((amenity) => {
          const Icon = amenity.icon;
          return (
            <Button
              key={amenity.id}
              type="button"
              variant={selectedAmenities.includes(amenity.id) ? "default" : "outline"}
              onClick={() => handleAmenityToggle(amenity.id)}
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

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Adicionar comodidades personalizadas</h4>
        <div className="flex space-x-2 mb-2">
          <Input 
            placeholder="Ex: Mesa de Bilhar" 
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            className="w-full"
          />
          <Button 
            type="button" 
            onClick={addCustomAmenity} 
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
                  onClick={() => removeCustomAmenity(amenity)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Comodidades com valores adicionais</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAddPricedAmenityOpen(true)}
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
                  onClick={() => removePricedAmenity(index)}
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

      <Dialog open={isAddPricedAmenityOpen} onOpenChange={setIsAddPricedAmenityOpen}>
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
                onChange={(e) => setNewPricedAmenity({...newPricedAmenity, name: e.target.value})}
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
                onChange={(e) => setNewPricedAmenity({...newPricedAmenity, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amenity-description">Descrição (opcional)</Label>
              <Input
                id="amenity-description"
                placeholder="Descreva detalhes sobre esta comodidade"
                value={newPricedAmenity.description}
                onChange={(e) => setNewPricedAmenity({...newPricedAmenity, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPricedAmenityOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addPricedAmenity}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormSection>
  );
}
