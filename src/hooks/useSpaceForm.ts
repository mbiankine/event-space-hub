
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SpaceFormValues } from '@/components/host/forms/types';

// Schema for space validation
const spaceFormSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres",
  }),
  description: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres",
  }),
  location: z.object({
    zipCode: z.string().min(8, "CEP é obrigatório"),
    street: z.string().min(5, "Endereço é obrigatório"),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().min(2, "Cidade é obrigatória"),
    state: z.string().min(2, "Estado é obrigatório"),
    country: z.string().default("Brasil"),
  }),
  pricingType: z.enum(['daily', 'hourly', 'both']),
  price: z.coerce.number().positive({
    message: "O preço deve ser um valor positivo",
  }).optional().nullable(),
  hourlyPrice: z.coerce.number().positive({
    message: "O preço por hora deve ser um valor positivo",
  }).optional().nullable(),
  capacity: z.coerce.number().positive({
    message: "A capacidade deve ser um número positivo",
  }),
  spaceType: z.string().min(1, {
    message: "Selecione um tipo de espaço",
  }),
  amenities: z.array(z.string()),
  customAmenities: z.array(z.string()).optional(),
  pricedAmenities: z.array(
    z.object({
      name: z.string(),
      price: z.number().positive(),
      description: z.string().optional()
    })
  ).optional(),
  availability: z.array(z.date()).min(1, {
    message: "Selecione pelo menos uma data disponível",
  }),
  images: z.array(z.any()).min(1, {
    message: "Adicione pelo menos uma imagem",
  }),
}).refine((data) => {
  if (data.pricingType === 'daily' || data.pricingType === 'both') {
    return !!data.price && data.price > 0;
  }
  return true;
}, {
  message: "Preço por diária é obrigatório",
  path: ["price"]
}).refine((data) => {
  if (data.pricingType === 'hourly' || data.pricingType === 'both') {
    return !!data.hourlyPrice && data.hourlyPrice > 0;
  }
  return true;
}, {
  message: "Preço por hora é obrigatório",
  path: ["hourlyPrice"]
});

export const useSpaceForm = (initialValues?: Partial<SpaceFormValues>) => {
  const [isValid, setIsValid] = useState(false);
  const [imagesValidated, setImagesValidated] = useState(false);

  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: initialValues || {
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
      pricingType: "daily",
      price: 0,
      hourlyPrice: 0,
      capacity: 0,
      spaceType: "",
      amenities: [],
      customAmenities: [],
      pricedAmenities: [],
      availability: [],
      images: [],
    },
    mode: "onChange",
  });

  // Watch for form changes and check validity
  useEffect(() => {
    const subscription = form.watch(() => {
      form.trigger().then(valid => {
        setIsValid(valid);
      });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Monitor images field specifically
  useEffect(() => {
    const subscription = form.watch("images", (value) => {
      const currentImages = value || [];
      setImagesValidated(currentImages.length > 0);
      
      if (currentImages.length > 0) {
        form.clearErrors("images");
      }
    });
    return () => subscription;
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
    }
  };

  return {
    form,
    isValid,
    imagesValidated,
    handleImageUpload
  };
};
