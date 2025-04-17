
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { SearchLocation } from './search/SearchLocation';
import { SearchDate } from './search/SearchDate';
import { SearchGuests } from './search/SearchGuests';
import { useSearchLocation } from './search/useSearchLocation';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(1);
  
  // Use the custom hook to manage location state and functionality
  const {
    location,
    isLoading,
    searchQuery,
    setSearchQuery,
    availableCities,
    searchingCities,
    getUserLocation,
    selectCity
  } = useSearchLocation();

  const handleGuestChange = (increment: number) => {
    const newValue = guestCount + increment;
    if (newValue >= 1 && newValue <= 100) {
      setGuestCount(newValue);
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
      <SearchLocation 
        location={location}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        availableCities={availableCities}
        searchingCities={searchingCities}
        getUserLocation={getUserLocation}
        selectCity={selectCity}
      />
      
      <SearchDate 
        date={date}
        setDate={setDate}
      />
      
      <SearchGuests 
        guestCount={guestCount}
        handleGuestChange={handleGuestChange}
      />
      
      <Button 
        onClick={handleSearch}
        className="rounded-full bg-primary ml-auto px-6 py-6 flex items-center"
      >
        <Search className="h-5 w-5 text-primary-foreground" />
      </Button>
    </div>
  );
};
