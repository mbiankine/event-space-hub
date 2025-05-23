import React, { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth/AuthContext';
import { ClientBookingsList } from '@/components/client/ClientBookingsList';
import { DashboardHeader } from '@/components/client/DashboardHeader';
import { FavoritesSection } from '@/components/client/FavoritesSection';
import { useClientBookings } from '@/hooks/useClientBookings';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { currentBookings, pastBookings, isLoading, error } = useClientBookings(user);
  
  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar seus dados', {
        description: 'Tente recarregar a página em alguns instantes.',
        action: {
          label: 'Tentar novamente',
          onClick: () => window.location.reload(),
        },
        icon: <AlertCircle />,
        duration: 5000,
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <DashboardHeader userName={user?.user_metadata?.full_name || 'Cliente'} />

        <Tabs defaultValue="reservations" className="mb-8">
          <TabsList>
            <TabsTrigger value="reservations">Minhas Reservas</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Reservas Atuais</h2>
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState 
                description="Não foi possível carregar suas reservas atuais. Tente novamente em alguns instantes."
              />
            ) : (
              <ClientBookingsList bookings={currentBookings} type="current" />
            )}

            <h2 className="text-xl font-semibold mb-4 mt-8">Histórico de Reservas</h2>
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState 
                title="Erro ao carregar histórico"
                description="Não foi possível carregar seu histórico de reservas. Tente novamente em alguns instantes."
              />
            ) : (
              <ClientBookingsList bookings={pastBookings} type="past" />
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <FavoritesSection />
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
