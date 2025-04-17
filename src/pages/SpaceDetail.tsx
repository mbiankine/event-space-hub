
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Wifi,
  Music,
  UtensilsCrossed,
  ParkingCircle,
  Tv,
  Volume2,
  Users,
  Clock,
  Star,
  Share,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from "@/components/host/LoadingState";

const SpaceDetail = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [space, setSpace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSpace = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setSpace(data);
      } catch (error) {
        console.error('Error fetching space:', error);
        // Navigate back if space not found
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpace();
  }, [id, navigate]);

  // Function to get image URLs from Supabase Storage
  const getImageUrls = (space: any) => {
    if (!space || !space.images) return [];
    
    return space.images.map((imagePath: string) => {
      const { data } = supabase.storage
        .from('spaces')
        .getPublicUrl(imagePath);
      return data.publicUrl;
    });
  };
  
  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-6 flex items-center justify-center">
        <LoadingState />
      </main>
      <Footer />
    </div>
  );
  
  if (!space) return null;
  
  const imageUrls = getImageUrls(space);
  
  // Helper function to map amenities to icons
  const getAmenityIcon = (amenity: string) => {
    const amenityMap: Record<string, any> = {
      "Wi-Fi": <Wifi className="h-5 w-5" />,
      "Sistema de Som": <Music className="h-5 w-5" />,
      "Catering": <UtensilsCrossed className="h-5 w-5" />,
      "Estacionamento": <ParkingCircle className="h-5 w-5" />,
      "Projetor": <Tv className="h-5 w-5" />,
      "Iluminação": <Volume2 className="h-5 w-5" />,
    };
    
    return amenityMap[amenity] || <Wifi className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">{space.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current" />
            <span>4.9</span>
            <span className="mx-1">·</span>
            <span className="underline">Novo</span>
            <span className="mx-1">·</span>
            <span>{space.location.city}, {space.location.state}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Heart className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
          {imageUrls.length > 0 ? (
            <>
              <div className="md:col-span-2 row-span-2">
                <img
                  src={imageUrls[0]}
                  alt={space.title}
                  className="w-full h-full object-cover rounded-l-xl"
                />
              </div>
              {imageUrls.slice(1, 5).map((url: string, index: number) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`${space.title} ${index + 1}`}
                    className={`w-full h-full object-cover ${index === 0 ? 'rounded-tr-xl' : index === 3 ? 'rounded-br-xl' : ''}`}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="md:col-span-4 aspect-video">
              <img
                src="https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop"
                alt={space.title}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Espaço inteiro hospedado por Anfitrião</h2>
                <p className="text-muted-foreground">
                  Até {space.capacity} pessoas
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Sobre o espaço</h3>
              <p className="text-muted-foreground">{space.description}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">O que este lugar oferece</h3>
              <div className="grid grid-cols-2 gap-4">
                {space.amenities && space.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>
                  {space.pricing_type === 'hourly' 
                    ? `R$ ${space.hourly_price}`
                    : `R$ ${space.price}`}
                </CardTitle>
                <CardDescription>
                  {space.pricing_type === 'hourly' 
                    ? 'por hora' 
                    : 'por diária'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Selecione a data</h4>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Convidados</h4>
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span>Número de convidados</span>
                    </div>
                    <select className="bg-transparent">
                      {[...Array(Math.min(5, Math.ceil(space.capacity / 25)))].map((_, i) => (
                        <option key={i} value={(i + 1) * 25}>{(i + 1) * 25}</option>
                      ))}
                      <option value={space.capacity}>{space.capacity}</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Duração</h4>
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span>Horas</span>
                    </div>
                    <select className="bg-transparent">
                      <option>4</option>
                      <option>6</option>
                      <option>8</option>
                      <option>12</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Reservar</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpaceDetail;
