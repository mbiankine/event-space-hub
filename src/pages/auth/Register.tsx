
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
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if the URL has a type parameter (for direct link to host registration)
  const params = new URLSearchParams(location.search);
  const initialAccountType = params.get('type') === 'host' ? 'host' : 'client';
  
  const [accountType, setAccountType] = React.useState<'client' | 'host'>(initialAccountType);

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
    console.log('Submitting registration form:', { ...data, accountType });
    try {
      const result = await signUp(data.email, data.password, data.fullName, accountType);
      
      if (result.success) {
        toast.success(`Conta de ${accountType === 'client' ? 'Cliente' : 'Anfitrião'} criada com sucesso!`);
        toast.info('Por favor, faça login com suas credenciais.');
        // Navigate is now handled in the signUp function in AuthContext
      } else if (result.error) {
        toast.error(result.error.message || 'Erro ao criar conta');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/auth/login" className="font-medium text-eventspace-500 hover:text-eventspace-400">
              entre com sua conta existente
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
              Crie uma conta como Cliente para encontrar e reservar espaços para seus eventos
            </p>
          </TabsContent>
          <TabsContent value="host" className="mt-4">
            <p className="text-sm text-gray-500 mb-4">
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
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : `Registrar como ${accountType === 'client' ? 'Cliente' : 'Anfitrião'}`}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
