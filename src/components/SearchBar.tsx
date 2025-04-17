
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Location {
  city: string;
  state: string;
}

export const SearchBar = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Tentar obter a localização do usuário quando o componente é montado
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // Usar a API de geocodificação reversa para obter cidade/estado
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
    const locationString = location ? `${location.city}, ${location.state}` : '';
    console.log(`Pesquisando: ${searchQuery}, Localização: ${locationString}`);
    // Aqui você implementaria a busca real
    // Por exemplo, navegando para uma página de resultados ou filtrando os espaços
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background p-2 rounded-full border shadow-sm flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 min-w-[140px] justify-start py-6 px-4 border-r border-border">
            <MapPin className="h-4 w-4" />
            <span className="text-sm truncate">
              {isLoading ? 'Carregando...' : location ? `${location.city}, ${location.state}` : 'Localização'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-72">
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Encontrar espaços em</h4>
              <Input 
                placeholder="Digite cidade ou estado"
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
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
            <span className="text-sm truncate">Data</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <h4 className="text-sm font-medium mb-2">Selecione uma data</h4>
            {/* Aqui você pode adicionar um seletor de data */}
            <p className="text-sm text-muted-foreground">Funcionalidade de calendário a ser implementada</p>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 min-w-[120px] justify-start py-6 px-4">
            <Users className="h-4 w-4" />
            <span className="text-sm truncate">Convidados</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <h4 className="text-sm font-medium mb-2">Número de convidados</h4>
            {/* Aqui você pode adicionar um seletor de quantidade */}
            <p className="text-sm text-muted-foreground">Funcionalidade de convidados a ser implementada</p>
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
