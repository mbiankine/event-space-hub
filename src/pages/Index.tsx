
import React, { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryFilters } from "@/components/CategoryFilters";
import { SpaceCard } from "@/components/SpaceCard";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from '@/integrations/supabase/client';
import { Space } from '@/types/SpaceTypes';
import { LoadingState } from '@/components/host/LoadingState';

const Index = () => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setSpaces(data || []);
      } catch (error: any) {
        console.error('Error fetching spaces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaces();
  }, []);

  // Function to get public URL for space images
  const getSpaceImageUrl = (space: any) => {
    if (space.images && space.images.length > 0) {
      const { data } = supabase.storage
        .from('spaces')
        .getPublicUrl(space.images[0]);
      return data.publicUrl;
    }
    
    return 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop';
  };

  // Convert database spaces to the format expected by SpaceCard
  const formattedSpaces = spaces.map(space => ({
    id: space.id,
    title: space.title,
    location: `${space.location.city}, ${space.location.state}`,
    price: space.price,
    rating: 4.9, // Default rating for now
    imageUrl: getSpaceImageUrl(space),
    available: space.availability && space.availability.length > 0 
      ? `Disponível em ${space.availability.length} datas`
      : "Consulte disponibilidade"
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Search bar section with background */}
      <div className="bg-background py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-left">Encontre o espaço perfeito para seu evento</h1>
            <SearchBar />
          </div>
        </div>
      </div>
      
      <CategoryFilters />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6 text-left">Espaços em destaque</h2>
          
          {isLoading ? (
            <LoadingState />
          ) : formattedSpaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {formattedSpaces.map((space) => (
                <SpaceCard key={space.id} {...space} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold">Nenhum espaço encontrado</h2>
              <p className="text-muted-foreground mt-2">Seja o primeiro a publicar um espaço para eventos!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
