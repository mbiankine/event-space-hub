
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SpaceFormValues } from '../forms/types';

export const useSpaceSubmission = () => {
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
      
      const allAmenities = [
        ...(values.amenities || []),
        ...(values.customAmenities || [])
      ];

      let price = null;
      let hourlyPrice = null;
      
      if (values.pricingType === 'daily' || values.pricingType === 'both') {
        price = parseFloat(values.price?.toString() || '0') || 0;
      }
      
      if (values.pricingType === 'hourly' || values.pricingType === 'both') {
        hourlyPrice = parseFloat(values.hourlyPrice?.toString() || '0') || 0;
      }

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
        created_at: new Date().toISOString()
      };

      const { data: insertedSpaceData, error: spaceError } = await supabase
        .from('spaces')
        .insert(spaceToInsert)
        .select()
        .single();

      if (spaceError) {
        console.error("Error inserting space:", spaceError);
        throw new Error(`Erro ao criar espaço: ${spaceError.message}`);
      }
      
      console.log("Space created successfully:", insertedSpaceData);
      
      if (values.images?.length > 0) {
        try {
          const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('spaces');
          if (bucketError && bucketError.message.includes('not found')) {
            console.log('Creating spaces bucket');
            await supabase.storage.createBucket('spaces', {
              public: true,
            });
          }
        } catch (error) {
          console.log('Error with bucket check/creation, trying to continue:', error);
        }
        
        const fileImages = values.images.filter(img => img instanceof File) as File[];
        const stringImages = values.images.filter(img => typeof img === 'string') as string[];
        
        console.log(`Processing ${fileImages.length} new images and ${stringImages.length} existing images`);
        
        const uploadPromises = fileImages.map(async (file: File, index: number) => {
          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${insertedSpaceData.id}/${index}-${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from('spaces')
              .upload(fileName, file);

            if (uploadError) {
              console.error("Error uploading image:", uploadError);
              throw uploadError;
            }
            
            return fileName;
          } catch (error) {
            console.error(`Error uploading image at index ${index}:`, error);
            return null;
          }
        });
        
        try {
          const uploadedPaths = await Promise.all(uploadPromises);
          const validPaths = uploadedPaths.filter(Boolean);
          const allImagePaths = [...stringImages, ...validPaths];
          
          const { error: updateError } = await supabase
            .from('spaces')
            .update({ images: allImagePaths })
            .eq('id', insertedSpaceData.id);
            
          if (updateError) {
            console.error("Error updating space with images:", updateError);
            throw updateError;
          }
          
          console.log(`Successfully updated space with ${allImagePaths.length} images`);
        } catch (error) {
          console.error("Error in image upload process:", error);
        }
      }
      
      toast.success("Seu espaço foi publicado com sucesso!");
      
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

  return { handleSubmit, isSubmitting };
};
