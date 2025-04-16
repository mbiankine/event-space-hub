
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
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useParams } from "react-router-dom";

// Mock data - in a real app this would come from an API
const space = {
  id: "1",
  title: "Salão Espaço Prime",
  description:
    "Um espaço perfeito para seu evento, com ampla área para convidados, iluminação sofisticada e ambiente climatizado. Ideal para casamentos, formaturas, congressos e eventos corporativos.",
  location: "São Paulo, SP",
  price: 1200,
  rating: 4.97,
  reviews: 127,
  host: "Ana Martins",
  hostSince: "2019",
  hostRating: 4.98,
  maxGuests: 150,
  images: [
    "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526041092449-209d556f7a32?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&auto=format&fit=crop",
  ],
  amenities: ["Wi-Fi", "Sistema de Som", "Catering", "Estacionamento", "Projetor", "Iluminação"],
};

const SpaceDetail = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { id } = useParams();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">{space.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current" />
            <span>{space.rating}</span>
            <span className="mx-1">·</span>
            <span className="underline">{space.reviews} avaliações</span>
            <span className="mx-1">·</span>
            <span>{space.location}</span>
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
          <div className="md:col-span-2 row-span-2">
            <img
              src={space.images[0]}
              alt={space.title}
              className="w-full h-full object-cover rounded-l-xl"
            />
          </div>
          <div>
            <img
              src={space.images[1]}
              alt={space.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src={space.images[2]}
              alt={space.title}
              className="w-full h-full object-cover rounded-tr-xl"
            />
          </div>
          <div>
            <img
              src={space.images[3]}
              alt={space.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src={space.images[4]}
              alt={space.title}
              className="w-full h-full object-cover rounded-br-xl"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Espaço inteiro hospedado por {space.host}</h2>
                <p className="text-muted-foreground">
                  Até {space.maxGuests} pessoas
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
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  <span>Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  <span>Sistema de Som</span>
                </div>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  <span>Catering</span>
                </div>
                <div className="flex items-center gap-2">
                  <ParkingCircle className="h-5 w-5" />
                  <span>Estacionamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  <span>Projetor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  <span>Iluminação</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>R$ {space.price}</CardTitle>
                <CardDescription>por diária</CardDescription>
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
                      <option>50</option>
                      <option>100</option>
                      <option>150</option>
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
