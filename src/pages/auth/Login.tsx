
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if the URL has a type parameter (for direct link to host login)
  const params = new URLSearchParams(location.search);
  const initialAccountType = params.get('type') === 'host' ? 'host' : 'client';
  
  const [accountType, setAccountType] = React.useState<'client' | 'host'>(initialAccountType);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log(`Attempting to login as ${accountType}`, data.email);
      await signIn(data.email, data.password, accountType);
      // Navigation is handled inside signIn function
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/auth/register" className="font-medium text-eventspace-500 hover:text-eventspace-400">
              crie uma nova conta
            </Link>
          </p>
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
            <p className="text-sm text-gray-500 mb-4">
              Entre como Cliente para encontrar e reservar os melhores espaços para seus eventos
            </p>
          </TabsContent>
          <TabsContent value="host" className="mt-4">
            <p className="text-sm text-gray-500 mb-4">
              Entre como Anfitrião para anunciar e gerenciar seus espaços para eventos
            </p>
          </TabsContent>
        </Tabs>
        
        <Form {...form}>
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
        </Form>
      </div>
    </div>
  );
};

export default Login;
