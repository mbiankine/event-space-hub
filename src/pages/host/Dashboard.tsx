
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
import { 
  Calendar, PlusCircle, DollarSign, Star, 
  TrendingUp, BarChart3, Clock, Users 
} from "lucide-react";

const HostDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Olá, Ana</h1>
            <p className="text-muted-foreground">Gerencie seus espaços e reservas</p>
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar novo espaço
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Receita Total</CardDescription>
              <CardTitle className="text-2xl">R$ 42.500</CardTitle>
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
              <CardTitle className="text-2xl">16</CardTitle>
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
              <CardDescription>Taxa de ocupação</CardDescription>
              <CardTitle className="text-2xl">78%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">5%</span>
                <span className="ml-1">que o mês passado</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Classificação média</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                4.9
                <Star className="h-4 w-4 ml-1 fill-current text-yellow-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Baseada em 127 avaliações
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="spaces" className="mb-8">
          <TabsList>
            <TabsTrigger value="spaces">Meus Espaços</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="spaces" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <div className="aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop"
                    alt="Espaço Prime"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Salão Espaço Prime</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm ml-1">4.97</span>
                    </div>
                  </div>
                  <CardDescription>São Paulo, SP</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm font-medium">R$ 1.200 / diária</p>
                  <div className="flex items-center mt-2">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Até 150 pessoas</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Calendário</Button>
                  <Button variant="outline" size="sm">Estatísticas</Button>
                </CardFooter>
              </Card>

              <Card>
                <div className="aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&auto=format&fit=crop"
                    alt="Casa de Campo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Casa de Campo Arvoredo</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm ml-1">4.99</span>
                    </div>
                  </div>
                  <CardDescription>Campos do Jordão, SP</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm font-medium">R$ 2.200 / diária</p>
                  <div className="flex items-center mt-2">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Até 80 pessoas</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Calendário</Button>
                  <Button variant="outline" size="sm">Estatísticas</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6 mt-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Próximas Reservas</h2>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Calendário
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

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Casa de Campo Arvoredo</CardTitle>
                      <CardDescription>Casamento</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 4.400</p>
                      <p className="text-sm text-muted-foreground">Cliente: Carlos Mendes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">20-22 de Junho, 2023</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Final de semana</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">80 convidados</span>
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

          <TabsContent value="analytics" className="space-y-6 mt-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reservas por Espaço</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mb-2" />
                    <p>Gráfico de Reservas</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receita por Espaço</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <DollarSign className="h-8 w-8 mb-2" />
                    <p>Gráfico de Receita</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informações do Anfitrião</CardTitle>
                <CardDescription>Atualize suas informações de contato e perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome</label>
                      <input type="text" className="w-full p-2 border rounded" defaultValue="Ana Martins" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input type="email" className="w-full p-2 border rounded" defaultValue="ana@email.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone</label>
                      <input type="tel" className="w-full p-2 border rounded" defaultValue="(11) 99876-5432" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Website</label>
                      <input type="url" className="w-full p-2 border rounded" defaultValue="https://anamartins.com" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea className="w-full p-2 border rounded h-24" defaultValue="Anfitriã desde 2019, especializada em espaços para eventos corporativos e celebrações. Possuo dois espaços em locais privilegiados de São Paulo."></textarea>
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
                <CardTitle>Preferências de Pagamento</CardTitle>
                <CardDescription>Configure suas informações bancárias e métodos de pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Banco</label>
                      <select className="w-full p-2 border rounded">
                        <option>Banco do Brasil</option>
                        <option>Itaú</option>
                        <option>Bradesco</option>
                        <option>Santander</option>
                        <option>Caixa Econômica Federal</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Conta</label>
                      <select className="w-full p-2 border rounded">
                        <option>Conta Corrente</option>
                        <option>Poupança</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Agência</label>
                      <input type="text" className="w-full p-2 border rounded" defaultValue="1234" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Conta</label>
                      <input type="text" className="w-full p-2 border rounded" defaultValue="56789-0" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Informações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default HostDashboard;
