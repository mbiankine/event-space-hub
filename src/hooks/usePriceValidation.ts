
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SpaceFormValues } from '@/components/host/forms/types';

export const usePriceValidation = (form: UseFormReturn<SpaceFormValues>) => {
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'pricingType' || name === 'price' || name === 'hourlyPrice') {
        const pricingType = form.getValues("pricingType");
        
        if (pricingType === 'daily' || pricingType === 'both') {
          form.trigger("price");
        }
        
        if (pricingType === 'hourly' || pricingType === 'both') {
          form.trigger("hourlyPrice");
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
};
