
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SpaceFormValues } from '@/components/host/forms/types';

export function useAmenities(form: UseFormReturn<SpaceFormValues>) {
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

  return {
    selectedAmenities,
    customAmenities,
    pricedAmenities,
    newAmenity,
    isAddPricedAmenityOpen,
    newPricedAmenity,
    handleAmenityToggle,
    handleAddCustomAmenity,
    handleRemoveCustomAmenity,
    handleAddPricedAmenity,
    handleRemovePricedAmenity,
    handlePricedAmenityChange,
    setNewAmenity,
    setIsAddPricedAmenityOpen
  };
}

