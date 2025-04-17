
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
  }),
  hourlyPrice: z.coerce.number().positive({
    message: "O preço por hora deve ser um valor positivo",
  }).optional(),
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
  // Update the type of images to accept either an array of Files or an array of strings
  images: z.array(z.any()).min(1, {
    message: "Adicione pelo menos uma imagem",
  }),
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
    mode: "onChange", // Importante: validar em tempo real
  });

  // Estado para controlar se todos os campos obrigatórios estão preenchidos
  const [isValid, setIsValid] = useState(false);

  // Acompanhar as mudanças nos valores e erros do formulário
  useEffect(() => {
    // Verificar se o formulário é válido
    const validateForm = async () => {
      const result = await form.trigger();
      setIsValid(result);
    };
    
    validateForm();
  }, [form.watch(), form]);

  // Update the function to explicitly handle the mixed array type
  const handleImageUpload = (images: File[]) => {
    // Create a properly typed array
    const currentImages = form.getValues("images") || [];
    
    // Remove any previous File objects if we're adding new ones
    const stringImages = currentImages.filter(img => typeof img === 'string') as string[];
    
    // Set the new array with both string URLs and File objects
    form.setValue("images", [...stringImages, ...images]);
    
    // Trigger validation after setting images
    form.trigger("images");
  };

  const handleSubmit = async (values: SpaceFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erro ao salvar espaço");
    }
  };

  // Obter a contagem de erros
  const errorCount = Object.keys(form.formState.errors).length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 text-foreground">
        {/* Mensagem de erro quando há campos inválidos */}
        {errorCount > 0 && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-destructive">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Verifique os campos obrigatórios</p>
              <p className="text-sm">Há {errorCount} {errorCount === 1 ? 'campo que precisa' : 'campos que precisam'} ser preenchido{errorCount === 1 ? '' : 's'} corretamente.</p>
            </div>
          </div>
        )}
        
        {/* Basic Information */}
        <BasicInfoSection control={form.control} />
        
        {/* Pricing */}
        <PricingSection control={form.control} watch={form.watch} />
        
        {/* Location */}
        <LocationSection control={form.control} form={form} />
        
        {/* Amenities */}
        <AmenitiesSection control={form.control} form={form} />
        
        {/* Availability */}
        <AvailabilitySection control={form.control} />
        
        {/* Images */}
        <ImageUploadSection 
          onChange={handleImageUpload} 
          initialImages={form.getValues("images")}
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
