
import { Control } from 'react-hook-form';
import { FormSection } from './FormSection';
import { SpaceFormValues } from './types';
import { BasicAmenitiesSection } from './amenities/BasicAmenitiesSection';
import { CustomAmenitiesSection } from './amenities/CustomAmenitiesSection';
import { PricedAmenitiesSection } from './amenities/PricedAmenitiesSection';
import { PricedAmenityDialog } from './amenities/PricedAmenityDialog';
import { useAmenities } from '@/hooks/useAmenities';

interface AmenitiesSectionProps {
  control: Control<SpaceFormValues>;
  form: any;
}

export function AmenitiesSection({ control, form }: AmenitiesSectionProps) {
  const {
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
  } = useAmenities(form);

  return (
    <FormSection title="Comodidades">
      <BasicAmenitiesSection 
        selectedAmenities={selectedAmenities}
        onToggle={handleAmenityToggle}
      />

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

