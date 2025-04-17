
import { useState } from 'react';
import { Control } from 'react-hook-form';
import { Search, MapPin } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSection } from './FormSection';
import { SpaceFormValues } from './types';

interface LocationSectionProps {
  control: Control<SpaceFormValues>;
  form: any; // Add more specific type if needed
}

export function LocationSection({ control, form }: LocationSectionProps) {
  const [isSearchingCep, setIsSearchingCep] = useState(false);

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

  return (
    <FormSection title="Localização">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <FormField
            control={control}
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
        control={control}
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
          control={control}
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
          control={control}
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
        control={control}
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
          control={control}
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
          control={control}
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
    </FormSection>
  );
}
