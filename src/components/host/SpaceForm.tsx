
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

// Import refactored components
import { BasicInfoSection } from './forms/BasicInfoSection';
import { PricingSection } from './forms/PricingSection';
import { LocationSection } from './forms/LocationSection';
import { AmenitiesSection } from './forms/AmenitiesSection';
import { AvailabilitySection } from './forms/AvailabilitySection';
import { ImageUploadSection } from './forms/ImageUploadSection';
import { SpaceFormValues } from './forms/types';
import { AlertCircle } from 'lucide-react';

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

interface SpaceFormProps {
  initialValues?: Partial<SpaceFormValues>;
  onSubmit: (values: SpaceFormValues) => void;
  isSubmitting?: boolean;
}

export function SpaceForm({ initialValues, onSubmit, isSubmitting = false }: SpaceFormProps) {
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

  const [isValid, setIsValid] = useState(false);

  // Watch for form changes and check validity
  useEffect(() => {
    const subscription = form.watch(() => {
      // Call validate to check form validity
      form.trigger().then(isValid => {
        console.log("Form validation status:", isValid, "Errors:", form.formState.errors);
        setIsValid(isValid);
      });
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleImageUpload = (newImages: File[]) => {
    try {
      // Get current images from form
      const currentImages = form.getValues("images") || [];
      
      // Filter out string images (already uploaded ones)
      const stringImages = currentImages.filter(img => typeof img === 'string');
      
      // Combine string images with new file images
      const combinedImages = [...stringImages, ...newImages];
      
      // Update the form with combined images
      form.setValue("images", combinedImages, { shouldValidate: true });
      
      console.log("Updated images in form:", combinedImages.length);
    } catch (error) {
      console.error("Error handling image upload:", error);
    }
  };

  const handleSubmit = async (values: SpaceFormValues) => {
    console.log("Form submission values:", values);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erro ao salvar espaço");
    }
  };

  const errorCount = Object.keys(form.formState.errors).length;
  
  useEffect(() => {
    if (errorCount > 0) {
      console.log("Form errors:", form.formState.errors);
    }
  }, [form.formState.errors, errorCount]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 text-foreground">
        {errorCount > 0 && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-destructive">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Verifique os campos obrigatórios</p>
              <p className="text-sm">Há {errorCount} {errorCount === 1 ? 'campo que precisa' : 'campos que precisam'} ser preenchido{errorCount === 1 ? '' : 's'} corretamente.</p>
            </div>
          </div>
        )}
        
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
          disabled={isSubmitting || !isValid} 
          className="w-full"
        >
          {isSubmitting ? "Salvando..." : "Publicar Espaço"}
        </Button>
      </form>
    </Form>
  );
}
