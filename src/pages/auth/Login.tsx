
import React, { useEffect } from 'react';
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

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  // Check if the URL has a type parameter (for direct link to host login)
  const params = new URLSearchParams(location.search);
  const initialAccountType = params.get('type') === 'host' ? 'host' : 'client';
  
  const [accountType, setAccountType] = React.useState<'client' | 'host'>(initialAccountType);

  // If user is already logged in, redirect to return URL or dashboard
  useEffect(() => {
    if (user) {
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log(`Attempting to login as ${accountType}`, data.email);
      await signIn(data.email, data.password, accountType);
      
      // Navigate to the return URL or dashboard after successful login
      if (returnUrl) {
        navigate(returnUrl);
      }
      // If no returnUrl, navigation is handled in the signIn function
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full bg-card">
        <CardContent className="pt-8 pb-4 px-8 space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Entre na sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Ou{' '}
              <Link to={`/auth/register${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`} className="font-medium text-primary hover:text-primary/90">
                crie uma nova conta
              </Link>
            </p>
            {returnUrl && returnUrl !== '/' && (
              <p className="mt-2 text-center text-sm text-blue-600">
                Você será redirecionado para finalizar sua reserva após o login
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
                Entre como Cliente para encontrar e reservar os melhores espaços para seus eventos
              </p>
            </TabsContent>
            <TabsContent value="host" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Entre como Anfitrião para anunciar e gerenciar seus espaços para eventos
              </p>
            </TabsContent>
          </Tabs>
          
          <Form {...useForm<LoginFormValues>({
            resolver: zodResolver(loginSchema),
            defaultValues: {
              email: '',
              password: '',
            },
          })}>
            {(form) => (
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
                <div className="space-y-4">
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
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : `Entrar como ${accountType === 'client' ? 'Cliente' : 'Anfitrião'}`}
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
