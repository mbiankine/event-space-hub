
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
  const { form, isValid, imagesValidated, handleImageUpload, isFormValid } = useSpaceForm(initialValues);
  
  const handleSubmit = async (values: SpaceFormValues) => {
    try {
      // Validar novamente antes de submeter
      const formIsValid = await isFormValid();
      
      if (!formIsValid) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      // Se o pricingType é daily, certifique-se de que o preço está definido
      if ((values.pricingType === "daily" || values.pricingType === "both") && 
          (!values.price || values.price <= 0)) {
        toast.error("Por favor, defina o preço por diária");
        return;
      }
      
      // Se o pricingType é hourly, certifique-se de que o preço por hora está definido
      if ((values.pricingType === "hourly" || values.pricingType === "both") && 
          (!values.hourlyPrice || values.hourlyPrice <= 0)) {
        toast.error("Por favor, defina o preço por hora");
        return;
      }
      
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erro ao salvar espaço");
    }
  };

  // Defina valores padrão para os preços com base no tipo de precificação
  React.useEffect(() => {
    const pricingType = form.watch("pricingType");
    const price = form.watch("price");
    const hourlyPrice = form.watch("hourlyPrice");
    
    if (pricingType === "daily" && !price) {
      form.setValue("price", 0);
    } else if (pricingType === "hourly" && !hourlyPrice) {
      form.setValue("hourlyPrice", 0);
    }
  }, [form.watch("pricingType"), form]);

  // O botão está habilitado se o formulário estiver válido e tivermos imagens
  const buttonShouldBeEnabled = (isValid && imagesValidated && !isSubmitting);

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
