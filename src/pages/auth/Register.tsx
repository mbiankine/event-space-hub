
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileCompletion } from '@/components/auth/ProfileCompletion';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { signUp, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const params = new URLSearchParams(location.search);
  const initialAccountType = params.get('type') === 'host' ? 'host' : 'client';
  
  const [accountType, setAccountType] = React.useState<'client' | 'host'>(initialAccountType);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this state

  useEffect(() => {
    if (user) {
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) { // Fix the comparison
      toast.error("As senhas não conferem");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUp(data.email, data.password, data.fullName, accountType);
      
      if (result.success) {
        setShowProfileCompletion(true);
        toast.success(`Conta de ${accountType === 'client' ? 'Cliente' : 'Anfitrião'} criada com sucesso!`);
      } else if (result.error) {
        toast.error(result.error.message || 'Erro ao criar conta');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileComplete = () => {
    setShowProfileCompletion(false);
    navigate(`/auth/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full bg-card">
        <CardContent className="pt-8 pb-4 px-8 space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Crie sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Ou{' '}
              <Link to={`/auth/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`} className="font-medium text-primary hover:text-primary/90">
                entre com sua conta existente
              </Link>
            </p>
            {returnUrl && returnUrl !== '/' && (
              <p className="mt-2 text-center text-sm text-blue-600">
                Após criar sua conta você poderá finalizar sua reserva
              </p>
            )}
          </div>
          
          <Tabs 
            defaultValue={accountType} 
            value={accountType}
            onValueChange={(value) => setAccountType(value as 'client' | 'host')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="client">Cliente</TabsTrigger>
              <TabsTrigger value="host">Anfitrião</TabsTrigger>
            </TabsList>
            <TabsContent value="client" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Crie uma conta como Cliente para encontrar e reservar espaços para seus eventos
              </p>
            </TabsContent>
            <TabsContent value="host" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Crie uma conta como Anfitrião para anunciar e gerenciar seus espaços para eventos
              </p>
            </TabsContent>
          </Tabs>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="******" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme sua senha</FormLabel>
                      <FormControl>
                        <Input placeholder="******" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading || isSubmitting ? 'Registrando...' : `Registrar como ${accountType === 'client' ? 'Cliente' : 'Anfitrião'}`}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ProfileCompletion 
        open={showProfileCompletion} 
        onComplete={handleProfileComplete}
      />
    </div>
  );
};

export default Register;
