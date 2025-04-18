
import { Control, UseFormWatch } from 'react-hook-form';
import { Clock, CalendarIcon, DollarSign } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { FormSection } from './FormSection';
import { SpaceFormValues } from './types';

interface PricingSectionProps {
  control: Control<SpaceFormValues>;
  watch: UseFormWatch<SpaceFormValues>;
}

export function PricingSection({ control, watch }: PricingSectionProps) {
  const pricingType = watch("pricingType");
  
  return (
    <FormSection title="Preço">
      <FormField
        control={control}
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
          control={control}
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
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      field.onChange(value);
                    }}
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
          control={control}
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
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      field.onChange(value);
                    }} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </FormSection>
  );
}
