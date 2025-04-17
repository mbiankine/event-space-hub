
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { Space } from '@/types/SpaceTypes';
import { PageHeader } from '@/components/host/PageHeader';
import { LoadingState } from '@/components/host/LoadingState';
import { EmptyStateCard } from '@/components/host/EmptyStateCard';
import { SpacesGrid } from '@/components/host/SpacesGrid';
import { HostLayout } from '@/components/layouts/HostLayout';

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
          .order('created_at', { ascending: false }) as { data: Space[], error: any };
          
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

  const handleAddNewSpace = () => {
    navigate('/host/spaces/new');
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('spaces')
        .delete()
        .eq('id', id) as { error: any };
        
      if (error) throw error;
      
      setSpaces(spaces.filter(space => space.id !== id));
      toast.success('Espaço excluído com sucesso');
    } catch (error: any) {
      console.error('Error deleting space:', error);
      toast.error('Erro ao excluir o espaço');
    }
  };

  return (
    <HostLayout
      title="Meus Espaços"
      description="Gerencie os espaços que você disponibiliza"
    >
      <PageHeader onAddClick={handleAddNewSpace} />

      {isLoading ? (
        <LoadingState />
      ) : spaces.length === 0 ? (
        <EmptyStateCard onAddClick={handleAddNewSpace} />
      ) : (
        <SpacesGrid 
          spaces={spaces} 
          onDelete={handleDelete} 
        />
      )}
    </HostLayout>
  );
};

export default ManageSpaces;
