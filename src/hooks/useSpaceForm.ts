
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpaceFormValues } from '@/components/host/forms/types';
import { useFormValidation } from './useFormValidation';
import { useImageValidation } from './useImageValidation';
import { usePriceValidation } from './usePriceValidation';
import { spaceFormSchema } from '@/lib/validation/spaceFormSchema';

export const useSpaceForm = (initialValues?: Partial<SpaceFormValues>) => {
  const defaultValues: Partial<SpaceFormValues> = {
    title: "",
    description: "",
    location: {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "Brasil",
    },
    pricingType: "daily" as const,
    price: 0,
    hourlyPrice: 0,
    capacity: 0,
    spaceType: "",
    amenities: [],
    customAmenities: [],
    pricedAmenities: [],
    availability: [],
    images: [],
  };

  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: initialValues || defaultValues,
    mode: "onChange",
  });

  const { isValid } = useFormValidation(form);
  const { imagesValidated, handleImageUpload } = useImageValidation(form);
  usePriceValidation(form);

  const isFormValid = async () => {
    const hasImages = (form.getValues("images") || []).length > 0;
    
    if (!hasImages) {
      form.setError("images", { 
        type: "manual", 
        message: "Adicione pelo menos uma imagem" 
      });
      return false;
    }
    
    const pricingType = form.getValues("pricingType");
    const price = form.getValues("price");
    const hourlyPrice = form.getValues("hourlyPrice");
    
    let priceValid = true;
    
    if (pricingType === 'daily' || pricingType === 'both') {
      if (typeof price !== 'number' || price <= 0) {
        form.setError("price", {
          type: "manual",
          message: "Preço por diária é obrigatório"
        });
        priceValid = false;
      }
    }
    
    if (pricingType === 'hourly' || pricingType === 'both') {
      if (typeof hourlyPrice !== 'number' || hourlyPrice <= 0) {
        form.setError("hourlyPrice", {
          type: "manual",
          message: "Preço por hora é obrigatório"
        });
        priceValid = false;
      }
    }
    
    const formValid = await form.trigger();
    return formValid && hasImages && priceValid;
  };

  return {
    form,
    isValid,
    imagesValidated,
    handleImageUpload,
    isFormValid
  };
};
