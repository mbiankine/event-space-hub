
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, PlusCircle, Pencil, Trash2, Calendar, Eye } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Space {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    state: string;
  };
  capacity: number;
  space_type: string;
  images: string[] | null;
  created_at: string;
}

const ManageSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchSpaces = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('host_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setSpaces(data || []);
      } catch (error: any) {
        console.error('Error fetching spaces:', error);
        toast.error('Erro ao carregar seus espaços');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaces();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('spaces')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSpaces(spaces.filter(space => space.id !== id));
      toast.success('Espaço excluído com sucesso');
    } catch (error: any) {
      console.error('Error deleting space:', error);
      toast.error('Erro ao excluir o espaço');
    }
  };

  const getSpaceImageUrl = (space: Space) => {
    if (space.images && space.images.length > 0) {
      const { data } = supabase.storage
        .from('spaces')
        .getPublicUrl(space.images[0]);
      return data.publicUrl;
    }
    return 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Meus Espaços</h1>
            <p className="text-muted-foreground">Gerencie seus espaços para eventos</p>
          </div>
          <Button onClick={() => navigate('/host/spaces/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar novo espaço
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : spaces.length === 0 ? (
          <Card className="text-center p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-primary/10 p-6">
                <PlusCircle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Nenhum espaço encontrado</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Você ainda não possui espaços publicados. Comece adicionando seu primeiro espaço para eventos.
              </p>
              <Button onClick={() => navigate('/host/spaces/new')}>
                Adicionar meu primeiro espaço
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card key={space.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={getSpaceImageUrl(space)}
                    alt={space.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{space.title}</CardTitle>
                  <CardDescription>{`${space.location.city}, ${space.location.state}`}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm font-medium">R$ {space.price.toFixed(2)} / diária</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {space.description}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/spaces/${space.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/host/spaces/${space.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/host/spaces/${space.id}/calendar`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Agenda
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Espaço</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este espaço? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(space.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageSpaces;
