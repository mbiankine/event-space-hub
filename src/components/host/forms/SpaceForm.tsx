
import React from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SpaceFormValues } from './types';
import { BasicInfoSection } from './BasicInfoSection';
import { PricingSection } from './PricingSection';
import { LocationSection } from './LocationSection';
import { AmenitiesSection } from './AmenitiesSection';
import { AvailabilitySection } from './AvailabilitySection';
import { ImageUploadSection } from './ImageUploadSection';
import { FormValidationMessage } from './FormValidationMessage';
import { useSpaceForm } from '@/hooks/useSpaceForm';

interface SpaceFormProps {
  initialValues?: Partial<SpaceFormValues>;
  onSubmit: (values: SpaceFormValues) => void;
  isSubmitting?: boolean;
}

export function SpaceForm({ initialValues, onSubmit, isSubmitting = false }: SpaceFormProps) {
  const { form, isValid, imagesValidated, handleImageUpload } = useSpaceForm(initialValues);
  
  const handleSubmit = async (values: SpaceFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erro ao salvar espaço");
    }
  };

  const errorCount = Object.keys(form.formState.errors).length;
  const buttonShouldBeEnabled = isValid && !isSubmitting && imagesValidated;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 text-foreground">
        <FormValidationMessage errorCount={errorCount} />
        
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

        <Button 
          type="submit" 
          disabled={!buttonShouldBeEnabled}
          className="w-full"
        >
          {isSubmitting ? "Salvando..." : "Publicar Espaço"}
        </Button>
      </form>
    </Form>
  );
}
