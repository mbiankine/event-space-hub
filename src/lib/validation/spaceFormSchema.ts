
import { z } from 'zod';

export const spaceFormSchema = z.object({
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
  if (data.pricingType === 'daily' || data.pricingType === 'both') {
    return typeof data.price === 'number' && data.price > 0;
  }
  return true;
}, {
  message: "Preço por diária é obrigatório",
  path: ["price"]
}).refine((data) => {
  if (data.pricingType === 'hourly' || data.pricingType === 'both') {
    return typeof data.hourlyPrice === 'number' && data.hourlyPrice > 0;
  }
  return true;
}, {
  message: "Preço por hora é obrigatório",
  path: ["hourlyPrice"]
});
