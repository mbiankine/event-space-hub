
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryFilters } from "@/components/CategoryFilters";
import { SpaceCard } from "@/components/SpaceCard";
import { SearchBar } from "@/components/SearchBar";

// Sample data - in a real app, this would come from an API
const featuredSpaces = [
  {
    id: "1",
    title: "Salão Espaço Prime",
    location: "São Paulo, SP",
    price: 1200,
    rating: 4.97,
    imageUrl: "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop",
    available: "Disponível de 10-15 Maio",
  },
  {
    id: "2",
    title: "Villa Garden Eventos",
    location: "Rio de Janeiro, RJ",
    price: 1500,
    rating: 4.89,
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop",
    available: "Disponível de 5-20 Junho",
  },
  {
    id: "3",
    title: "Terraço Panorama",
    location: "Belo Horizonte, MG",
    price: 800,
    rating: 4.92,
    imageUrl: "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=800&auto=format&fit=crop",
    available: "Disponível de 1-30 Julho",
  },
  {
    id: "4",
    title: "Casa de Campo Arvoredo",
    location: "Campos do Jordão, SP",
    price: 2200,
    rating: 4.99,
    imageUrl: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&auto=format&fit=crop",
    available: "Disponível de 15-30 Agosto",
  },
  {
    id: "5",
    title: "Auditório Central",
    location: "Brasília, DF",
    price: 1800,
    rating: 4.87,
    imageUrl: "https://images.unsplash.com/photo-1526041092449-209d556f7a32?w=800&auto=format&fit=crop",
    available: "Disponível de 1-10 Setembro",
  },
  {
    id: "6",
    title: "Galpão Industrial Eventos",
    location: "Curitiba, PR",
    price: 1300,
    rating: 4.85,
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop",
    available: "Disponível de 20-30 Outubro",
  },
  {
    id: "7",
    title: "Mansão Colonial",
    location: "Salvador, BA",
    price: 1900,
    rating: 4.96,
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&auto=format&fit=crop",
    available: "Disponível de 5-15 Novembro",
  },
  {
    id: "8",
    title: "Espaço Jardim Secreto",
    location: "Fortaleza, CE",
    price: 950,
    rating: 4.91,
    imageUrl: "https://images.unsplash.com/photo-1533647046292-0884172f37ce?w=800&auto=format&fit=crop",
    available: "Disponível de 10-25 Dezembro",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Barra de pesquisa */}
      <div className="bg-white shadow-sm py-4 sticky top-16 z-40">
        <div className="container px-4 md:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>
      
      <CategoryFilters />
      <main className="flex-1">
        <div className="container px-4 md:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredSpaces.map((space) => (
              <SpaceCard key={space.id} {...space} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
