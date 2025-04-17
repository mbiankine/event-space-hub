
import React, { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ClientBookingsList, ClientBooking } from '@/components/client/ClientBookingsList';
import { toast } from 'sonner';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [currentBookings, setCurrentBookings] = useState<ClientBooking[]>([]);
  const [pastBookings, setPastBookings] = useState<ClientBooking[]>([]);
  const [favoriteSpaces, setFavoriteSpaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching bookings for user ID:", user.id);
        
        // Fetch current bookings (future dates)
        const today = new Date().toISOString().split('T')[0];
        
        // Try to get active bookings from view first
        const { data: activeBookings, error: activeError } = await supabase
          .from('active_bookings')
          .select('*')
          .eq('client_id', user.id)
          .gte('booking_date', today)
          .order('booking_date', { ascending: true });
          
        if (activeError) {
          console.error("Error fetching from active_bookings view:", activeError);
          // Fallback to direct bookings query if view fails
          const { data: directBookings, error: directError } = await supabase
            .from('bookings')
            .select(`
              *,
              spaces (
                title,
                images,
                location,
                host_id
              )
            `)
            .eq('client_id', user.id)
            .gte('booking_date', today)
            .order('booking_date', { ascending: true });
          
          if (directError) throw directError;
          
          const formattedBookings = directBookings.map((booking) => ({
            ...booking,
            space_title: booking.spaces?.title || booking.space_title,
            images: booking.spaces?.images,
            location: booking.spaces?.location,
            host_id: booking.spaces?.host_id || booking.host_id
          }));
          
          setCurrentBookings(formattedBookings || []);
        } else {
          setCurrentBookings(activeBookings || []);
        }
        
        // Fetch past bookings
        const { data: pastBookingsData, error: pastError } = await supabase
          .from('bookings')
          .select(`
            *,
            spaces (
              title,
              images,
              location,
              host_id
            )
          `)
          .eq('client_id', user.id)
          .lt('booking_date', today)
          .order('booking_date', { ascending: false });
          
        if (pastError) throw pastError;
        
        // Transform past bookings data to match the format we need
        const pastBookingsFormatted = pastBookingsData.map((booking) => ({
          ...booking,
          space_title: booking.spaces?.title || booking.space_title,
          images: booking.spaces?.images,
          location: booking.spaces?.location,
          host_id: booking.spaces?.host_id || booking.host_id
        }));
        
        setPastBookings(pastBookingsFormatted || []);
        console.log("Fetched bookings:", {
          current: activeBookings?.length || 0,
          past: pastBookingsFormatted?.length || 0
        });
        
        // TODO: Implement favorites system in the future
        setFavoriteSpaces([]);
        
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Erro ao carregar suas reservas. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Olá, {user?.user_metadata?.full_name || 'Cliente'}
            </h1>
            <p className="text-muted-foreground">Gerencie suas reservas e preferências</p>
          </div>
          <Button asChild>
            <Link to="/">Procurar novos espaços</Link>
          </Button>
        </div>

        <Tabs defaultValue="reservations" className="mb-8">
          <TabsList>
            <TabsTrigger value="reservations">Minhas Reservas</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Reservas Atuais</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-9 bg-gray-200 rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <ClientBookingsList bookings={currentBookings} type="current" />
            )}

            <h2 className="text-xl font-semibold mb-4 mt-8">Histórico de Reservas</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-9 bg-gray-200 rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <ClientBookingsList bookings={pastBookings} type="past" />
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Seus Espaços Favoritos</h2>
            
            {favoriteSpaces.length === 0 ? (
              <Card className="p-6 text-center">
                <CardContent className="pt-6 pb-4">
                  <h3 className="text-xl font-medium mb-2">
                    Sem favoritos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Você ainda não adicionou nenhum espaço aos favoritos.
                  </p>
                  <Button asChild>
                    <Link to="/">Procurar espaços</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoriteSpaces.map((space) => (
                  <Card key={space.id}>
                    <div className="aspect-square relative">
                      <img
                        src={space.image_url || "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop"}
                        alt={space.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-medium">{space.title}</h3>
                      <p className="text-sm text-muted-foreground">{space.location}</p>
                      <p className="text-sm font-medium mt-1">R$ {space.price} / diária</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/spaces/${space.id}`}>Ver disponibilidade</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Configurações da Conta</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados pessoais</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded" 
                        defaultValue={user?.user_metadata?.full_name || ''} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded" 
                        defaultValue={user?.email || ''} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone</label>
                      <input 
                        type="tel" 
                        className="w-full p-2 border rounded" 
                        defaultValue={user?.user_metadata?.phone || ''}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button>Salvar Alterações</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>Gerencie como você recebe notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Emails sobre reservas</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Emails promocionais</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Notificações de novos espaços</span>
                    <input type="checkbox" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Preferências</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
