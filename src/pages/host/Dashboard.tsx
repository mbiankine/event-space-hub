
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, PlusCircle, DollarSign, Star, 
  TrendingUp, BarChart3, Clock, Users, 
  Home, ListChecks, Settings, MessageCircle 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const HostDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalSpaces: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch spaces
        const { data: spacesData } = await supabase
          .from('spaces')
          .select('*')
          .limit(3);
          
        setSpaces(spacesData || []);
        
        // Calculate stats (In a real app, these would come from the database)
        setStats({
          totalSpaces: spacesData?.length || 0,
          totalBookings: 8,
          totalRevenue: 12500,
          averageRating: 4.9
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Olá, {profile?.full_name || 'Anfitrião'}</h1>
            <p className="text-muted-foreground">Gerencie seus espaços e reservas</p>
          </div>
          <Button asChild>
            <Link to="/host/spaces/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar novo espaço
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Receita Total</CardDescription>
              <CardTitle className="text-2xl">R$ {stats.totalRevenue.toLocaleString('pt-BR')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">12%</span>
                <span className="ml-1">que o mês passado</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reservas este mês</CardDescription>
              <CardTitle className="text-2xl">{stats.totalBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">8%</span>
                <span className="ml-1">que o mês passado</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Espaços</CardDescription>
              <CardTitle className="text-2xl">{stats.totalSpaces}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <Link to="/host/spaces" className="text-primary hover:underline">
                  Gerenciar espaços
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Classificação média</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                {stats.averageRating}
                <Star className="h-4 w-4 ml-1 fill-current text-yellow-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Baseada em 32 avaliações
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Menu Rápido</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/host/dashboard">
                    <Home className="mr-2 h-5 w-5" /> Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/host/spaces">
                    <ListChecks className="mr-2 h-5 w-5" /> Meus Espaços
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/host/bookings">
                    <Calendar className="mr-2 h-5 w-5" /> Reservas
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/host/messages">
                    <MessageCircle className="mr-2 h-5 w-5" /> Mensagens
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/host/analytics">
                    <BarChart3 className="mr-2 h-5 w-5" /> Análises
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/host/settings">
                    <Settings className="mr-2 h-5 w-5" /> Configurações
                  </Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/host/spaces/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo Espaço
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="col-span-1 lg:col-span-3">
            <Tabs defaultValue="spaces" className="h-full flex flex-col">
              <TabsList>
                <TabsTrigger value="spaces">Meus Espaços</TabsTrigger>
                <TabsTrigger value="bookings">Reservas</TabsTrigger>
                <TabsTrigger value="analytics">Análises</TabsTrigger>
              </TabsList>

              <TabsContent value="spaces" className="flex-1 space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Meus Espaços</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/host/spaces">Ver todos</Link>
                  </Button>
                </div>
                
                {spaces.length === 0 ? (
                  <Card className="text-center p-6">
                    <CardContent className="flex flex-col items-center pt-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <PlusCircle className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Adicione seu primeiro espaço</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        Comece publicando seu primeiro espaço para eventos e comece a receber reservas.
                      </p>
                      <Button asChild>
                        <Link to="/host/spaces/new">Publicar um espaço</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {spaces.map((space) => (
                      <Card key={space.id}>
                        <div className="aspect-video relative">
                          <img
                            src="https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop"
                            alt={space.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{space.title}</CardTitle>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-current text-yellow-400" />
                              <span className="text-sm ml-1">4.9</span>
                            </div>
                          </div>
                          <CardDescription>{space.location?.city}, {space.location?.state}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm font-medium">R$ {space.price} / diária</p>
                          <div className="flex items-center mt-2">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Até {space.capacity} pessoas</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/host/spaces/${space.id}/edit`}>Editar</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/host/spaces/${space.id}/calendar`}>Agenda</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/host/spaces/${space.id}/analytics`}>Estatísticas</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookings" className="flex-1 space-y-4 mt-4">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Próximas Reservas</h2>
                  <Button variant="outline" asChild>
                    <Link to="/host/bookings">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Calendário
                    </Link>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Salão Espaço Prime</CardTitle>
                          <CardDescription>Aniversário de 15 anos</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ 1.200</p>
                          <p className="text-sm text-muted-foreground">Cliente: Maria Santos</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">15 de Maio, 2023</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">18:00 - 23:00</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">100 convidados</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Mensagem</Button>
                      <Button>Detalhes</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="flex-1 space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho Mensal</CardTitle>
                    <CardDescription>Monitoramento das reservas e receita</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mb-2" />
                      <p>Gráfico de Desempenho Mensal</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostDashboard;
