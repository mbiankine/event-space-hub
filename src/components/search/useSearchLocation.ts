
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Location, SpaceWithLocation } from './types';

export function useSearchLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const selectCity = (city: Location) => {
    setLocation(city);
    setSearchQuery('');
  };

  return {
    location,
    isLoading,
    searchQuery,
    setSearchQuery,
    availableCities,
    searchingCities,
    getUserLocation,
    selectCity
  };
}
