
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from '../ui/command';
import { Location } from './types';

interface SearchLocationProps {
  location: Location | null;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  availableCities: Location[];
  searchingCities: boolean;
  getUserLocation: () => void;
  selectCity: (city: Location) => void;
}

export const SearchLocation = ({
  location,
  isLoading,
  searchQuery,
  setSearchQuery,
  availableCities,
  searchingCities,
  getUserLocation,
  selectCity
}: SearchLocationProps) => {
  
  const renderCityResults = () => {
    if (searchingCities) return <div className="p-2 text-sm text-center">Carregando cidades...</div>;
    
    const filteredCities = searchQuery 
      ? availableCities.filter(loc => 
          loc.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
          loc.state.toLowerCase().includes(searchQuery.toLowerCase())
        ) 
      : availableCities;
    
    if (filteredCities.length === 0) {
      return <div className="p-2 text-sm text-center">Nenhuma cidade encontrada</div>;
    }
    
    return (
      <Command>
        <CommandInput 
          placeholder="Digite para buscar..." 
          value={searchQuery} 
          onValueChange={setSearchQuery}
          className="border-none focus:ring-0"
        />
        <CommandList>
          <CommandEmpty>Nenhuma cidade encontrada</CommandEmpty>
          <CommandGroup heading="Cidades disponíveis">
            {filteredCities.map((city, index) => (
              <CommandItem 
                key={index} 
                onSelect={() => selectCity(city)}
                className="cursor-pointer hover:bg-accent"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {city.city}, {city.state}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 min-w-[140px] justify-start py-6 px-4 border-r border-border">
          <MapPin className="h-4 w-4" />
          <span className="text-sm truncate text-left">
            {isLoading ? 'Carregando...' : location ? `${location.city}, ${location.state}` : 'Localização'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-72">
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-left">Encontrar espaços em</h4>
            {renderCityResults()}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={getUserLocation}
            >
              <MapPin className="h-4 w-4 mr-2" /> Usar minha localização atual
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
