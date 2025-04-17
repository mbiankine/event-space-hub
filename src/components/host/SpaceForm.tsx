
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
  availability: z.array(z.date()),
  images: z.array(z.any()).optional(),
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
  });

  const handleImageUpload = (images: File[]) => {
    form.setValue("images", images);
  };

  const handleSubmit = async (values: SpaceFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erro ao salvar espaço");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 text-foreground">
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
          disabled={isSubmitting} 
          className="w-full"
        >
          {isSubmitting ? "Salvando..." : "Publicar Espaço"}
        </Button>
      </form>
    </Form>
  );
}
