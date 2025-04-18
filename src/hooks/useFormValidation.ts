
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SpaceFormValues } from '@/components/host/forms/types';

export const useFormValidation = (form: UseFormReturn<SpaceFormValues>) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const subscription = form.watch(() => {
      // Count only top-level errors, ignoring nested structure
      const hasErrors = Object.keys(form.formState.errors).some(key => {
        if (typeof form.formState.errors[key] === 'object' && form.formState.errors[key]?.type !== 'manual') {
          return false;
        }
        return true;
      });

      setIsValid(!hasErrors);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return { isValid };
};
