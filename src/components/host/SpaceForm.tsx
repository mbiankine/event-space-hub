
import React from 'react';
import { Form } from "@/components/ui/form";
import { SpaceFormValues } from './forms/types';
import { BasicInfoSection } from './forms/BasicInfoSection';
import { PricingSection } from './forms/PricingSection';
import { LocationSection } from './forms/LocationSection';
import { AmenitiesSection } from './forms/AmenitiesSection';
import { AvailabilitySection } from './forms/AvailabilitySection';
import { ImageUploadSection } from './forms/ImageUploadSection';
import { FormValidationMessage } from './forms/FormValidationMessage';
import { SpaceFormActions } from './forms/SpaceFormActions';
import { useSpaceForm } from '@/hooks/useSpaceForm';

interface SpaceFormProps {
  initialValues?: Partial<SpaceFormValues>;
  onSubmit: (values: SpaceFormValues) => void;
  isSubmitting?: boolean;
}

export function SpaceForm({ initialValues, onSubmit, isSubmitting = false }: SpaceFormProps) {
  const { 
    form, 
    isValid, 
    imagesValidated, 
    handleImageUpload 
  } = useSpaceForm(initialValues);

  const handleSubmit = async (values: SpaceFormValues) => {
    try {
      await onSubmit(values);
    } catch (error: any) {
      console.error('Error submitting form:', error);
    }
  };

  // This determines if the button should be enabled
  const buttonShouldBeEnabled = isValid && !isSubmitting && imagesValidated;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 text-foreground">
        <FormValidationMessage errors={form.formState.errors} />
        
        <BasicInfoSection control={form.control} />
        <PricingSection control={form.control} watch={form.watch} />
        <LocationSection control={form.control} form={form} />
        <AmenitiesSection control={form.control} form={form} />
        <AvailabilitySection control={form.control} />
        
        <ImageUploadSection 
          onChange={handleImageUpload} 
          initialImages={form.getValues("images")}
          error={!!form.formState.errors.images}
        />

        <SpaceFormActions 
          isSubmitting={isSubmitting} 
          isEnabled={buttonShouldBeEnabled} 
        />
      </form>
    </Form>
  );
}
