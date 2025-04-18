
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SpaceFormValues } from '@/components/host/forms/types';
import { toast } from 'sonner';

export const useImageValidation = (form: UseFormReturn<SpaceFormValues>) => {
  const [imagesValidated, setImagesValidated] = useState(false);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'images' || name?.startsWith('images.')) {
        const currentImages = form.getValues("images") || [];
        if (currentImages.length > 0) {
          setImagesValidated(true);
          form.clearErrors("images");
        } else {
          setImagesValidated(false);
        }
      }
    });

    const currentImages = form.getValues("images") || [];
    setImagesValidated(currentImages.length > 0);
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleImageUpload = (newImages: File[]) => {
    try {
      const currentImages = form.getValues("images") || [];
      const stringImages = currentImages.filter(img => typeof img === 'string');
      const combinedImages = [...stringImages, ...newImages];
      
      form.setValue("images", combinedImages, { shouldValidate: true });
      
      if (combinedImages.length > 0) {
        setImagesValidated(true);
        form.clearErrors("images");
      }
    } catch (error) {
      console.error("Error handling image upload:", error);
      toast.error("Erro ao processar imagens");
    }
  };

  return { imagesValidated, handleImageUpload };
};
