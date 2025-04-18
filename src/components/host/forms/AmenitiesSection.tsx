
import { useState } from 'react';
import { Control } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { FormSection } from './FormSection';
import { SpaceFormValues } from './types';
import { amenitiesOptions } from './amenities/amenitiesData';
import { CustomAmenitiesSection } from './amenities/CustomAmenitiesSection';
import { PricedAmenitiesSection } from './amenities/PricedAmenitiesSection';
import { PricedAmenityDialog } from './amenities/PricedAmenityDialog';

interface AmenitiesSectionProps {
  control: Control<SpaceFormValues>;
  form: any;
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
      const updated = prev.includes(amenityId) 
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId];
      form.setValue("amenities", updated);
      return updated;
    });
  };

  const handleAddCustomAmenity = () => {
    if (newAmenity.trim() && !customAmenities.includes(newAmenity.trim())) {
      const updatedCustomAmenities = [...customAmenities, newAmenity.trim()];
      setCustomAmenities(updatedCustomAmenities);
      form.setValue("customAmenities", updatedCustomAmenities);
      setNewAmenity("");
    }
  };

  const handleRemoveCustomAmenity = (amenity: string) => {
    const updatedCustomAmenities = customAmenities.filter(item => item !== amenity);
    setCustomAmenities(updatedCustomAmenities);
    form.setValue("customAmenities", updatedCustomAmenities);
  };

  const handleAddPricedAmenity = () => {
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

  const handleRemovePricedAmenity = (index: number) => {
    const updatedPricedAmenities = pricedAmenities.filter((_, i) => i !== index);
    setPricedAmenities(updatedPricedAmenities);
    form.setValue("pricedAmenities", updatedPricedAmenities);
  };

  const handlePricedAmenityChange = (field: string, value: string | number) => {
    setNewPricedAmenity(prev => ({ ...prev, [field]: value }));
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

      <CustomAmenitiesSection
        customAmenities={customAmenities}
        onAdd={handleAddCustomAmenity}
        onRemove={handleRemoveCustomAmenity}
        newAmenity={newAmenity}
        onNewAmenityChange={setNewAmenity}
      />

      <PricedAmenitiesSection
        pricedAmenities={pricedAmenities}
        onRemove={handleRemovePricedAmenity}
        onAdd={() => setIsAddPricedAmenityOpen(true)}
        isDialogOpen={isAddPricedAmenityOpen}
        onOpenChange={setIsAddPricedAmenityOpen}
      />

      <PricedAmenityDialog
        open={isAddPricedAmenityOpen}
        onOpenChange={setIsAddPricedAmenityOpen}
        newPricedAmenity={newPricedAmenity}
        onNewPricedAmenityChange={handlePricedAmenityChange}
        onAdd={handleAddPricedAmenity}
      />
    </FormSection>
  );
}
