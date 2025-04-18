
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SpaceFormValues } from '@/components/host/forms/types';
import { toast } from 'sonner';

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
  price: z.coerce.number().optional().nullable(),
  hourlyPrice: z.coerce.number().optional().nullable(),
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
  // Validação apenas se o tipo for daily ou both E se o preço for 0 ou não informado
  if ((data.pricingType === 'daily' || data.pricingType === 'both') && 
      (typeof data.price !== 'number' || data.price <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Preço por diária é obrigatório",
  path: ["price"]
}).refine((data) => {
  // Validação apenas se o tipo for hourly ou both E se o preço por hora for 0 ou não informado
  if ((data.pricingType === 'hourly' || data.pricingType === 'both') && 
      (typeof data.hourlyPrice !== 'number' || data.hourlyPrice <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Preço por hora é obrigatório",
  path: ["hourlyPrice"]
});

export const useSpaceForm = (initialValues?: Partial<SpaceFormValues>) => {
  const [isValid, setIsValid] = useState(false);
  const [imagesValidated, setImagesValidated] = useState(false);

  // Definir valores iniciais com um tipo de preço padrão
  const defaultValues = {
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
    pricingType: "daily", // Definido como daily por padrão
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

  // Combinar com valores iniciais se fornecidos
  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: initialValues || defaultValues,
    mode: "onChange",
  });

  // Verificar o estado inicial das imagens
  useEffect(() => {
    const currentImages = form.getValues("images") || [];
    if (currentImages && currentImages.length > 0) {
      setImagesValidated(true);
      form.clearErrors("images");
    }
  }, [form]);

  // Watch for form changes and check validity
  useEffect(() => {
    const subscription = form.watch((values) => {
      // Count only top-level errors, ignoring nested structure
      const hasErrors = Object.keys(form.formState.errors).some(key => {
        // Don't count parent objects that have nested errors
        if (typeof form.formState.errors[key] === 'object' && form.formState.errors[key]?.type !== 'manual') {
          return false;
        }
        return true;
      });

      setIsValid(!hasErrors);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Monitor specifically the images field
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'images' || name?.startsWith('images.')) {
        const currentImages = form.getValues("images") || [];
        
        if (currentImages.length > 0) {
          setImagesValidated(true);
          form.clearErrors("images");
        } else {
          setImagesValidated(false);
        }
      }

      // Adicionando validação específica para os tipos de preço
      if (name === 'pricingType' || name === 'price' || name === 'hourlyPrice') {
        const pricingType = form.getValues("pricingType");
        
        // Revalidar os campos baseado no tipo de precificação
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

  // Verificar explicitamente se o formulário está realmente válido
  const isFormValid = async () => {
    // Verificar se há imagens
    const hasImages = (form.getValues("images") || []).length > 0;
    
    // Se não tiver imagens, marcar o campo como erro
    if (!hasImages) {
      form.setError("images", { 
        type: "manual", 
        message: "Adicione pelo menos uma imagem" 
      });
      setImagesValidated(false);
      return false;
    }
    
    // Verificar preços com base no tipo de precificação
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
    
    // Verificar outros campos com trigger
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
