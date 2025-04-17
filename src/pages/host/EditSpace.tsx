import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SpaceForm } from '@/components/host/SpaceForm';
import { SpaceFormValues } from '@/components/host/forms/types';
import { toast } from 'sonner';
import { LoadingState } from '@/components/host/LoadingState';

const EditSpace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [space, setSpace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchSpace = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Verify ownership
        if (data.host_id !== user.id) {
          toast.error('Você não tem permissão para editar este espaço');
          navigate('/host/spaces');
          return;
        }
        
        setSpace(data);
      } catch (error: any) {
        console.error('Error fetching space:', error);
        toast.error('Erro ao carregar dados do espaço');
        navigate('/host/spaces');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpace();
  }, [id, user, navigate]);

  const handleSubmit = async (values: SpaceFormValues) => {
    if (!user || !id) return;
    
    setIsSubmitting(true);
    try {
      // Handle image uploads if there are new images
      if (values.images && values.images.length > 0 && values.images[0] instanceof File) {
        const imageFiles = values.images as File[];
        const uploadedImagePaths = [];
        
        // Upload each new image
        for (const imageFile of imageFiles) {
          const filePath = `${user.id}/${Date.now()}-${imageFile.name}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('spaces')
            .upload(filePath, imageFile);
            
          if (uploadError) throw uploadError;
          uploadedImagePaths.push(filePath);
        }
        
        // Replace images array with paths
        values.images = uploadedImagePaths;
      } else {
        // Keep original images if no new ones
        values.images = space.images;
      }
      
      // Update space data
      const { error } = await supabase
        .from('spaces')
        .update({
          title: values.title,
          description: values.description,
          price: values.price,
          hourly_price: values.hourlyPrice || null,
          capacity: values.capacity,
          space_type: values.spaceType,
          pricing_type: values.pricingType,
          location: values.location,
          amenities: values.amenities.concat(values.customAmenities || []),
          availability: values.availability,
          images: values.images,
          updated_at: new Date()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Espaço atualizado com sucesso!');
      navigate('/host/spaces');
    } catch (error: any) {
      console.error('Error updating space:', error);
      toast.error('Erro ao atualizar espaço');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8 flex items-center justify-center">
          <LoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  // Transform DB space format to form format
  const initialValues: SpaceFormValues = {
    title: space?.title || '',
    description: space?.description || '',
    price: space?.price || 0,
    hourlyPrice: space?.hourly_price || 0,
    capacity: space?.capacity || 0,
    spaceType: space?.space_type || '',
    pricingType: space?.pricing_type || 'daily',
    location: space?.location || {},
    amenities: space?.amenities || [],
    customAmenities: [],
    availability: space?.availability?.map((dateStr: string) => new Date(dateStr)) || [],
    images: space?.images || []
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Editar Espaço</h1>
          <p className="text-muted-foreground">Atualize as informações do seu espaço</p>
        </div>
        
        <SpaceForm 
          initialValues={initialValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </main>
      <Footer />
    </div>
  );
};

export default EditSpace;
