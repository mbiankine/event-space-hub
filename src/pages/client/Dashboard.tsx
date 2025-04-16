
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Olá, João</h1>
            <p className="text-muted-foreground">Gerencie suas reservas e preferências</p>
          </div>
          <Button>Procurar novos espaços</Button>
        </div>

        <Tabs defaultValue="reservations" className="mb-8">
          <TabsList>
            <TabsTrigger value="reservations">Minhas Reservas</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Reservas Atuais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Salão Espaço Prime</CardTitle>
                  <CardDescription>São Paulo, SP</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
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
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Detalhes</Button>
                  <Button variant="destructive">Cancelar</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Terraço Panorama</CardTitle>
                  <CardDescription>Belo Horizonte, MG</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">10 de Junho, 2023</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">19:00 - 03:00</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">75 convidados</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Detalhes</Button>
                  <Button variant="destructive">Cancelar</Button>
                </CardFooter>
              </Card>
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-8">Histórico de Reservas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Villa Garden Eventos</CardTitle>
                  <CardDescription>Rio de Janeiro, RJ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">20 de Abril, 2023</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">120 convidados</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Avaliar</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Auditório Central</CardTitle>
                  <CardDescription>Brasília, DF</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">5 de Março, 2023</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">80 convidados</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Avaliar</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Seus Espaços Favoritos</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card>
                <div className="aspect-square relative">
                  <img
                    src="https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop"
                    alt="Espaço favorito"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium">Salão Espaço Prime</h3>
                  <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                  <p className="text-sm font-medium mt-1">R$ 1200 / diária</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Ver disponibilidade</Button>
                </CardFooter>
              </Card>

              <Card>
                <div className="aspect-square relative">
                  <img
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop"
                    alt="Espaço favorito"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium">Villa Garden Eventos</h3>
                  <p className="text-sm text-muted-foreground">Rio de Janeiro, RJ</p>
                  <p className="text-sm font-medium mt-1">R$ 1500 / diária</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Ver disponibilidade</Button>
                </CardFooter>
              </Card>
            </div>
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
                      <input type="text" className="w-full p-2 border rounded" defaultValue="João Silva" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input type="email" className="w-full p-2 border rounded" defaultValue="joao@email.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone</label>
                      <input type="tel" className="w-full p-2 border rounded" defaultValue="(11) 98765-4321" />
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
