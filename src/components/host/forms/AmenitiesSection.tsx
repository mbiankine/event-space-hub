
import { useState } from 'react';
import { Control } from 'react-hook-form';
import { Plus, X, Wifi, Car, Music, UtensilsCrossed, Lightbulb, Sofa, ShieldCheck, Accessibility } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection } from './FormSection';
import { SpaceFormValues } from './types';

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
  
  const [newAmenity, setNewAmenity] = useState("");

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
    </FormSection>
  );
}
