
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SpaceForm } from '@/components/host/SpaceForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AddNewSpace = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (values: any) => {
    if (!user) {
      toast.error("Você precisa estar logado para publicar um espaço");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. First upload the space data
      const { data: spaceData, error: spaceError } = await supabase
        .from('spaces')
        .insert({
          title: values.title,
          description: values.description,
          location: values.location,
          price: values.price,
          capacity: values.capacity,
          space_type: values.spaceType,
          amenities: values.amenities,
          host_id: user.id,
          availability: values.availability.map((date: Date) => date.toISOString().split('T')[0]),
        } as any)
        .select()
        .single();

      if (spaceError) throw spaceError;
      
      // 2. Upload images if there are any
      if (values.images && values.images.length > 0) {
        const uploadPromises = values.images.map(async (file: File, index: number) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${spaceData.id}/${index}-${Date.now()}.${fileExt}`;
          const filePath = `spaces/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('spaces')
            .upload(filePath, file);

          if (uploadError) throw uploadError;
          
          return filePath;
        });
        
        const uploadedPaths = await Promise.all(uploadPromises);
        
        // 3. Update the space with image paths
        const { error: updateError } = await supabase
          .from('spaces')
          .update({
            images: uploadedPaths
          } as any)
          .eq('id', spaceData.id);
          
        if (updateError) throw updateError;
      }
      
      toast.success("Seu espaço foi publicado com sucesso!");
      navigate('/host/dashboard');
    } catch (error: any) {
      console.error('Error publishing space:', error);
      toast.error(error.message || "Erro ao publicar o espaço");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Publique seu Espaço</h1>
          <p className="text-muted-foreground">
            Preencha os detalhes abaixo para publicar seu espaço para eventos
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <SpaceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddNewSpace;
