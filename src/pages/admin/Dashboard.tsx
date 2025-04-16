
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
  Users, Building2, BarChart3, DollarSign, Search,
  TrendingUp, Settings, User, CheckCircle, Shield 
} from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Painel de Administração</h1>
            <p className="text-muted-foreground">Gerencie toda a plataforma EventSpace</p>
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configurações da Plataforma
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Usuários</CardDescription>
              <CardTitle className="text-2xl">3,487</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">15%</span>
                <span className="ml-1">este mês</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Espaços Ativos</CardDescription>
              <CardTitle className="text-2xl">578</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">8%</span>
                <span className="ml-1">este mês</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reservas este mês</CardDescription>
              <CardTitle className="text-2xl">942</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">12%</span>
                <span className="ml-1">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Receita Total</CardDescription>
              <CardTitle className="text-2xl">R$ 1.2M</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">18%</span>
                <span className="ml-1">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="mb-8">
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="spaces">Espaços</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="relative grow max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar usuários..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <select className="border rounded p-2 text-sm">
                  <option>Todos os tipos</option>
                  <option>Clientes</option>
                  <option>Anfitriões</option>
                  <option>Administradores</option>
                </select>
                <select className="border rounded p-2 text-sm">
                  <option>Status: Todos</option>
                  <option>Ativos</option>
                  <option>Inativos</option>
                  <option>Pendentes</option>
                </select>
                <Button variant="outline" size="sm">Filtrar</Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Tipo</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Registro</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 align-middle">João Silva</td>
                      <td className="p-4 align-middle">joao@email.com</td>
                      <td className="p-4 align-middle">Cliente</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span></td>
                      <td className="p-4 align-middle">10/01/2023</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Ana Martins</td>
                      <td className="p-4 align-middle">ana@email.com</td>
                      <td className="p-4 align-middle">Anfitrião</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span></td>
                      <td className="p-4 align-middle">05/03/2019</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Carlos Mendes</td>
                      <td className="p-4 align-middle">carlos@email.com</td>
                      <td className="p-4 align-middle">Cliente</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendente</span></td>
                      <td className="p-4 align-middle">22/04/2023</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Roberto Alves</td>
                      <td className="p-4 align-middle">roberto@email.com</td>
                      <td className="p-4 align-middle">Administrador</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span></td>
                      <td className="p-4 align-middle">15/01/2023</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">Mostrando 4 de 3,487 usuários</div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>Anterior</Button>
                  <Button variant="outline" size="sm" className="bg-secondary">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Próximo</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spaces" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="relative grow max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar espaços..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <select className="border rounded p-2 text-sm">
                  <option>Todos os tipos</option>
                  <option>Salões</option>
                  <option>Casas</option>
                  <option>Espaços ao ar livre</option>
                </select>
                <select className="border rounded p-2 text-sm">
                  <option>Status: Todos</option>
                  <option>Ativos</option>
                  <option>Inativos</option>
                  <option>Em revisão</option>
                </select>
                <Button variant="outline" size="sm">Filtrar</Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Anfitrião</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Localização</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Capacidade</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Preço</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Salão Espaço Prime</td>
                      <td className="p-4 align-middle">Ana Martins</td>
                      <td className="p-4 align-middle">São Paulo, SP</td>
                      <td className="p-4 align-middle">150</td>
                      <td className="p-4 align-middle">R$ 1.200</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span></td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Casa de Campo Arvoredo</td>
                      <td className="p-4 align-middle">Ana Martins</td>
                      <td className="p-4 align-middle">Campos do Jordão, SP</td>
                      <td className="p-4 align-middle">80</td>
                      <td className="p-4 align-middle">R$ 2.200</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span></td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Terraço Panorama</td>
                      <td className="p-4 align-middle">Pedro Costa</td>
                      <td className="p-4 align-middle">Belo Horizonte, MG</td>
                      <td className="p-4 align-middle">100</td>
                      <td className="p-4 align-middle">R$ 800</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Em revisão</span></td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Auditório Central</td>
                      <td className="p-4 align-middle">Marcos Oliveira</td>
                      <td className="p-4 align-middle">Brasília, DF</td>
                      <td className="p-4 align-middle">200</td>
                      <td className="p-4 align-middle">R$ 1.800</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Inativo</span></td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">Mostrando 4 de 578 espaços</div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>Anterior</Button>
                  <Button variant="outline" size="sm" className="bg-secondary">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Próximo</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="relative grow max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar reservas..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <select className="border rounded p-2 text-sm">
                  <option>Status: Todos</option>
                  <option>Confirmadas</option>
                  <option>Pendentes</option>
                  <option>Canceladas</option>
                </select>
                <Button variant="outline" size="sm">Filtrar</Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Cliente</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Espaço</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Data</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Valor</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 align-middle">#12345</td>
                      <td className="p-4 align-middle">Maria Santos</td>
                      <td className="p-4 align-middle">Salão Espaço Prime</td>
                      <td className="p-4 align-middle">15/05/2023</td>
                      <td className="p-4 align-middle">R$ 1.200</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmada</span></td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">#12346</td>
                      <td className="p-4 align-middle">Carlos Mendes</td>
                      <td className="p-4 align-middle">Casa de Campo Arvoredo</td>
                      <td className="p-4 align-middle">20-22/06/2023</td>
                      <td className="p-4 align-middle">R$ 4.400</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendente</span></td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">#12347</td>
                      <td className="p-4 align-middle">Ana Paula</td>
                      <td className="p-4 align-middle">Terraço Panorama</td>
                      <td className="p-4 align-middle">10/07/2023</td>
                      <td className="p-4 align-middle">R$ 800</td>
                      <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelada</span></td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">Mostrando 3 de 942 reservas</div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>Anterior</Button>
                  <Button variant="outline" size="sm" className="bg-secondary">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Próximo</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receita Mensal</CardTitle>
                  <CardDescription>Acompanhamento financeiro</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mb-2" />
                    <p>Gráfico de Receita</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Novos Usuários</CardTitle>
                  <CardDescription>Crescimento da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Users className="h-8 w-8 mb-2" />
                    <p>Gráfico de Crescimento</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Espaços por Região</CardTitle>
                  <CardDescription>Distribuição geográfica</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Building2 className="h-8 w-8 mb-2" />
                    <p>Gráfico de Distribuição</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Conversão</CardTitle>
                  <CardDescription>Visitas vs. Reservas</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <DollarSign className="h-8 w-8 mb-2" />
                    <p>Gráfico de Conversão</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funções administrativas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col py-4 px-6 justify-start items-start">
                <User className="h-8 w-8 mb-2" />
                <span className="font-medium">Adicionar Usuário</span>
                <span className="text-xs text-muted-foreground mt-1">Criar nova conta</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4 px-6 justify-start items-start">
                <Building2 className="h-8 w-8 mb-2" />
                <span className="font-medium">Aprovar Espaços</span>
                <span className="text-xs text-muted-foreground mt-1">5 pendentes</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4 px-6 justify-start items-start">
                <CheckCircle className="h-8 w-8 mb-2" />
                <span className="font-medium">Verificar Anfitriões</span>
                <span className="text-xs text-muted-foreground mt-1">8 pendentes</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4 px-6 justify-start items-start">
                <Shield className="h-8 w-8 mb-2" />
                <span className="font-medium">Moderar Avaliações</span>
                <span className="text-xs text-muted-foreground mt-1">12 pendentes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
