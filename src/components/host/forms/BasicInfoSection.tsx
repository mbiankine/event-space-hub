
import { Control } from 'react-hook-form';
import { Users } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { FormSection } from './FormSection';
import { SpaceFormValues } from './types';

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

interface BasicInfoSectionProps {
  control: Control<SpaceFormValues>;
}

export function BasicInfoSection({ control }: BasicInfoSectionProps) {
  return (
    <FormSection title="Informações Básicas">
      <FormField
        control={control}
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
        control={control}
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
          control={control}
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
          control={control}
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
    </FormSection>
  );
}
