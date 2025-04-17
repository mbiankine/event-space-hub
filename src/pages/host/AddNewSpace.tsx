
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SpaceForm } from '@/components/host/SpaceForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { SpaceFormValues } from '@/components/host/forms/types';

const AddNewSpace = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (values: SpaceFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para publicar um espaço");
      return;
    }

    setIsSubmitting(true);
    console.log("Form values being submitted:", values);
    
    try {
      // Prepare location data with the new fields
      const locationData = {
        street: values.location.street,
        number: values.location.number || '',
        complement: values.location.complement || '',
        neighborhood: values.location.neighborhood || '',
        city: values.location.city,
        state: values.location.state,
        zipCode: values.location.zipCode,
        country: values.location.country,
      };
      
      // Combine standard and custom amenities
      const allAmenities = [
        ...(values.amenities || []),
        ...(values.customAmenities || [])
      ];

      // Adjust values according to pricing type
      let price = null;
      let hourlyPrice = null;
      
      if (values.pricingType === 'daily' || values.pricingType === 'both') {
        price = parseFloat(values.price.toString()) || 0;
      }
      
      if (values.pricingType === 'hourly' || values.pricingType === 'both') {
        hourlyPrice = parseFloat(values.hourlyPrice?.toString() || '0') || 0;
      }

      // Prepare space data
      const spaceToInsert = {
        title: values.title,
        description: values.description,
        location: locationData,
        capacity: parseInt(values.capacity.toString()) || 0,
        space_type: values.spaceType,
        amenities: allAmenities,
        custom_amenities: values.pricedAmenities || [],
        host_id: user.id,
        availability: (values.availability || []).map((date: Date) => date.toISOString().split('T')[0]),
        pricing_type: values.pricingType,
        price: price,
        hourly_price: hourlyPrice,
        active: true,
        created_at: new Date().toISOString()
      };

      // First upload the space data
      const { data: insertedSpaceData, error: spaceError } = await supabase
        .from('spaces')
        .insert(spaceToInsert)
        .select()
        .single();

      if (spaceError) throw spaceError;
      
      console.log("Space created successfully:", insertedSpaceData);
      
      // Upload images if there are any
      if (values.images?.length > 0) {
        const uploadPromises = values.images.map(async (file: File, index: number) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${insertedSpaceData.id}/${index}-${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('spaces')
            .upload(fileName, file);

          if (uploadError) throw uploadError;
          
          return fileName;
        });
        
        const uploadedPaths = await Promise.all(uploadPromises);
        
        // Update space with image paths
        const { error: updateError } = await supabase
          .from('spaces')
          .update({ images: uploadedPaths })
          .eq('id', insertedSpaceData.id);
          
        if (updateError) throw updateError;
      }
      
      toast.success("Seu espaço foi publicado com sucesso!");
      
      // Redirect after success
      setTimeout(() => {
        navigate('/host/spaces');
      }, 1500);
      
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

        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
          <SpaceForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddNewSpace;
