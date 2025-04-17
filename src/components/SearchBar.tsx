
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from './ui/command';

interface Location {
  city: string;
  state: string;
}

// Define a typed version of the space with location as we expect it
interface SpaceWithLocation {
  location: {
    city: string;
    state: string;
    [key: string]: any; // Allow other location properties
  };
  [key: string]: any; // Allow other space properties
}

export const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(1);
  const [availableCities, setAvailableCities] = useState<Location[]>([]);
  const [searchingCities, setSearchingCities] = useState(false);

  useEffect(() => {
    // Try to get the user's location when the component mounts
    getUserLocation();
    
    // Load available cities from spaces
    loadAvailableCities();
  }, []);

  const loadAvailableCities = async () => {
    setSearchingCities(true);
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select('location')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        // Extract unique cities from locations, properly typed
        const uniqueCities = Array.from(
          new Map(
            data.map((item: SpaceWithLocation) => {
              const cityKey = `${item.location.city}-${item.location.state}`;
              return [cityKey, { city: item.location.city, state: item.location.state }];
            })
          ).values()
        );
        
        setAvailableCities(uniqueCities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setSearchingCities(false);
    }
  };

  const getUserLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // Use reverse geocoding API to get city/state
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=pt-BR`)
            .then(response => response.json())
            .then(data => {
              const city = data.address.city || data.address.town || data.address.village;
              const state = data.address.state;
              
              if (city && state) {
                setLocation({ city, state });
              }
              setIsLoading(false);
            })
            .catch(err => {
              console.error("Erro ao obter localização:", err);
              setIsLoading(false);
            });
        },
        error => {
          console.error("Erro de geolocalização:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocalização não suportada");
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Construct query parameters
    const params = new URLSearchParams();
    
    if (location) {
      params.append('city', location.city);
      params.append('state', location.state);
    }
    
    if (date) {
      params.append('date', format(date, 'yyyy-MM-dd'));
    }
    
    if (guestCount > 0) {
      params.append('guests', guestCount.toString());
    }
    
    // Navigate to search results page
    navigate(`/?${params.toString()}`);
  };

  const selectCity = (city: Location) => {
    setLocation(city);
    setSearchQuery('');
  };

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

  const handleGuestChange = (increment: number) => {
    const newValue = guestCount + increment;
    if (newValue >= 1 && newValue <= 100) {
      setGuestCount(newValue);
    }
  };

  const getUserLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // Use reverse geocoding API to get city/state
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=pt-BR`)
            .then(response => response.json())
            .then(data => {
              const city = data.address.city || data.address.town || data.address.village;
              const state = data.address.state;
              
              if (city && state) {
                setLocation({ city, state });
              }
              setIsLoading(false);
            })
            .catch(err => {
              console.error("Erro ao obter localização:", err);
              setIsLoading(false);
            });
        },
        error => {
          console.error("Erro de geolocalização:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocalização não suportada");
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Construct query parameters
    const params = new URLSearchParams();
    
    if (location) {
      params.append('city', location.city);
      params.append('state', location.state);
    }
    
    if (date) {
      params.append('date', format(date, 'yyyy-MM-dd'));
    }
    
    if (guestCount > 0) {
      params.append('guests', guestCount.toString());
    }
    
    // Navigate to search results page
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="w-full bg-background p-2 rounded-full border border-border shadow-sm flex items-center">
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
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 min-w-[120px] justify-start py-6 px-4 border-r border-border">
            <Calendar className="h-4 w-4" />
            <span className="text-sm truncate text-left">
              {date ? format(date, 'dd MMM', { locale: pt }) : 'Data'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto">
          <div className="p-2">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
              fromDate={new Date()}
            />
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 min-w-[120px] justify-start py-6 px-4">
            <Users className="h-4 w-4" />
            <span className="text-sm truncate text-left">
              {guestCount} {guestCount === 1 ? 'convidado' : 'convidados'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="p-4">
            <h4 className="text-sm font-medium mb-4 text-left">Número de convidados</h4>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleGuestChange(-1)}
                disabled={guestCount <= 1}
              >
                -
              </Button>
              <span className="text-lg font-medium">{guestCount}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleGuestChange(1)}
                disabled={guestCount >= 100}
              >
                +
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button 
        onClick={handleSearch}
        className="rounded-full bg-primary ml-auto px-6 py-6 flex items-center"
      >
        <Search className="h-5 w-5 text-primary-foreground" />
      </Button>
    </div>
  );
};
