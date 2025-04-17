
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon, 
  MapPin, 
  Users, 
  DollarSign, 
  X, 
  Clock, 
  Calendar as CalendarIcon2, 
  Check, 
  Plus,
  Search
} from 'lucide-react';
import { 
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

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
  availability: z.array(z.date()),
  images: z.array(z.any()).optional(),
});

type SpaceFormValues = z.infer<typeof spaceFormSchema>;

// Amenities options
const amenitiesOptions = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "parking", label: "Estacionamento" },
  { id: "sound", label: "Sistema de Som" },
  { id: "lighting", label: "Iluminação" },
  { id: "catering", label: "Serviço de Buffet" },
  { id: "furniture", label: "Mobiliário" },
  { id: "security", label: "Segurança" },
  { id: "accessibility", label: "Acessibilidade" },
];

// Space types
const spaceTypes = [
  { id: "indoor", label: "Espaço Interno" },
  { id: "outdoor", label: "Espaço Externo" },
  { id: "hybrid", label: "Híbrido (Interno e Externo)" },
  { id: "rooftop", label: "Terraço/Rooftop" },
  { id: "villa", label: "Chácara/Sítio" },
  { id: "auditorium", label: "Auditório" },
  { id: "hall", label: "Salão" },
];

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
      availability: [],
      images: [],
    },
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialValues?.amenities || []
  );
  
  const [customAmenities, setCustomAmenities] = useState<string[]>(
    initialValues?.customAmenities || []
  );
  
  const [newAmenity, setNewAmenity] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const pricingType = form.watch("pricingType");

  useEffect(() => {
    // Atualizar o formulário com os amenities personalizados
    form.setValue("customAmenities", customAmenities);
  }, [customAmenities, form]);

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenityId)) {
        return prev.filter((id) => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
    const currentAmenities = form.getValues("amenities");
    if (currentAmenities.includes(amenityId)) {
      form.setValue(
        "amenities",
        currentAmenities.filter((id) => id !== amenityId)
      );
    } else {
      form.setValue("amenities", [...currentAmenities, amenityId]);
    }
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !customAmenities.includes(newAmenity.trim())) {
      const updatedCustomAmenities = [...customAmenities, newAmenity.trim()];
      setCustomAmenities(updatedCustomAmenities);
      form.setValue("customAmenities", updatedCustomAmenities);
      setNewAmenity("");
    }
  };

  const removeCustomAmenity = (amenity: string) => {
    setCustomAmenities((prev) => prev.filter((item) => item !== amenity));
  };

  const searchCEP = async () => {
    const cep = form.getValues("location.zipCode").replace(/\D/g, '');
    
    if (cep.length !== 8) {
      form.setError("location.zipCode", {
        type: "manual",
        message: "CEP inválido. Por favor, digite um CEP válido."
      });
      return;
    }

    try {
      setIsSearchingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        form.setError("location.zipCode", {
          type: "manual", 
          message: "CEP não encontrado."
        });
        return;
      }
      
      // Preencher os campos com os dados obtidos
      form.setValue("location.street", data.logradouro || "");
      form.setValue("location.neighborhood", data.bairro || "");
      form.setValue("location.city", data.localidade || "");
      form.setValue("location.state", data.uf || "");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      form.setError("location.zipCode", {
        type: "manual",
        message: "Erro ao buscar CEP. Tente novamente mais tarde."
      });
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedImages((prev) => [...prev, ...newFiles]);
      // Also update the form value
      form.setValue("images", [...uploadedImages, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    form.setValue(
      "images",
      uploadedImages.filter((_, i) => i !== index)
    );
  };

  const selectAllDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const allDays = eachDayOfInterval({ start, end });
    
    // Get current selected dates
    const currentDates = form.getValues("availability");
    
    // Filter out dates that are already in the current month to avoid duplicates
    const currentDatesWithoutThisMonth = currentDates.filter(d => 
      d.getMonth() !== date.getMonth() || d.getFullYear() !== date.getFullYear());
    
    // Add all days of the selected month
    form.setValue("availability", [...currentDatesWithoutThisMonth, ...allDays]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Básicas</h3>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Espaço</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Salão de Festas Villa Verde" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva seu espaço em detalhes..." 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade de Pessoas</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        className="pl-10" 
                        placeholder="100" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spaceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Espaço</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de espaço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {spaceTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preço</h3>

          <FormField
            control={form.control}
            name="pricingType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Tipo de Precificação</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <label htmlFor="daily" className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        <CalendarIcon2 className="mr-2 h-4 w-4" />
                        Por Diária
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <label htmlFor="hourly" className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        <Clock className="mr-2 h-4 w-4" />
                        Por Hora
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <label htmlFor="both" className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        <CalendarIcon2 className="mr-2 h-4 w-4" />
                        Ambos
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(pricingType === "daily" || pricingType === "both") && (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço por Diária (R$)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        className="pl-10" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(pricingType === "hourly" || pricingType === "both") && (
            <FormField
              control={form.control}
              name="hourlyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço por Hora (R$)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        className="pl-10" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Localização</h3>
          
          <div className="flex space-x-4">
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="location.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={searchCEP}
                        disabled={isSearchingCep}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="location.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location.complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Apto, Sala, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location.neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Comodidades</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {amenitiesOptions.map((amenity) => (
              <Button
                key={amenity.id}
                type="button"
                variant={selectedAmenities.includes(amenity.id) ? "default" : "outline"}
                onClick={() => handleAmenityToggle(amenity.id)}
                className="justify-start"
              >
                {selectedAmenities.includes(amenity.id) ? (
                  <span className="mr-2">✓</span>
                ) : null}
                {amenity.label}
              </Button>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Adicionar comodidades personalizadas</h4>
            <div className="flex space-x-2 mb-2">
              <Input 
                placeholder="Ex: Mesa de Bilhar" 
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="w-full"
              />
              <Button type="button" onClick={addCustomAmenity} variant="outline" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {customAmenities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {customAmenities.map((amenity, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary text-secondary-foreground py-1 px-3 rounded-full flex items-center text-sm"
                  >
                    {amenity}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1"
                      onClick={() => removeCustomAmenity(amenity)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Disponibilidade</h3>
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Selecione as datas disponíveis</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value && field.value.length > 0
                          ? `${field.value.length} data(s) selecionada(s)`
                          : "Selecione as datas"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-2 border-b">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          const today = new Date();
                          selectAllDaysInMonth(today);
                        }}
                      >
                        <CalendarIcon2 className="mr-2 h-4 w-4" />
                        Selecionar todo o mês atual
                      </Button>
                    </div>
                    <Calendar
                      initialFocus
                      mode="multiple"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Imagens</h3>
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Carregar Imagens
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG, WEBP até 10MB
            </p>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {uploadedImages.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Publicar Espaço"}
        </Button>
      </form>
    </Form>
  );
}
