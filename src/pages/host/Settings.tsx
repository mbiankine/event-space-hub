
import React, { useState } from 'react';
import { HostLayout } from '@/components/layouts/HostLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  bio: z.string().max(500, { message: 'Bio deve ter no máximo 500 caracteres' }).optional(),
});

const notificationsFormSchema = z.object({
  newBooking: z.boolean().default(true),
  bookingUpdates: z.boolean().default(true),
  messageNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      bio: ''
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      newBooking: true,
      bookingUpdates: true,
      messageNotifications: true,
      marketingEmails: false,
    },
  });

  // Load user profile data
  React.useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            profileForm.setValue('fullName', data.full_name || '');
            profileForm.setValue('bio', data.bio || '');
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };
    
    loadProfile();
  }, [user?.id, profileForm]);

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          bio: values.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onNotificationsSubmit = (values: z.infer<typeof notificationsFormSchema>) => {
    console.log(values);
    toast({
      title: "Configurações de notificação atualizadas",
      description: "Suas preferências de notificação foram salvas.",
    });
  };

  return (
    <HostLayout title="Configurações" description="Gerencie suas preferências e informações pessoais">
      <div className="space-y-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          </TabsList>
          
          {/* Perfil Tab */}
          <TabsContent value="profile" className="text-left">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Informações Pessoais</h3>
                <p className="text-sm text-muted-foreground">
                  Atualize suas informações pessoais e de contato.
                </p>
              </div>
              
              <Separator />
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu.email@exemplo.com" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Este é o seu email registrado. Não é possível alterá-lo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input placeholder="Conte um pouco sobre você..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Esta informação será exibida publicamente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          {/* Notificações Tab */}
          <TabsContent value="notifications" className="text-left">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Preferências de notificação</h3>
                <p className="text-sm text-muted-foreground">
                  Configure como você deseja receber notificações.
                </p>
              </div>
              
              <Separator />
              
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationsForm.control}
                      name="newBooking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Novas Reservas</FormLabel>
                            <FormDescription>
                              Receba notificações quando um cliente fizer uma nova reserva.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="bookingUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Atualizações de Reservas</FormLabel>
                            <FormDescription>
                              Receba notificações sobre mudanças em reservas existentes.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="messageNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificações de Mensagem</FormLabel>
                            <FormDescription>
                              Receba notificações quando um cliente enviar uma mensagem.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Emails de Marketing</FormLabel>
                            <FormDescription>
                              Receba emails sobre novidades, recursos e dicas.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Salvar preferências</Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          {/* Pagamentos Tab */}
          <TabsContent value="payments" className="text-left">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Configurações de pagamento</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas preferências de pagamento e informações bancárias.
                </p>
              </div>
              
              <Separator />
              
              <div className="grid gap-6">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Conta bancária</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Banco</span>
                      <span>Banco do Brasil</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Agência</span>
                      <span>1234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Conta</span>
                      <span>12345-6</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm">Alterar dados bancários</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Histórico de pagamentos</h4>
                  <div className="text-sm text-muted-foreground">
                    Nenhum pagamento processado nos últimos 30 dias.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HostLayout>
  );
};

export default Settings;
