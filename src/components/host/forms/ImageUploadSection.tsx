
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FormSection } from './FormSection';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ImageUploadSectionProps {
  onChange: (images: File[]) => void;
  initialImages?: Array<string | File>;
  error?: boolean;
}

export function ImageUploadSection({ onChange, initialImages = [], error = false }: ImageUploadSectionProps) {
  const [uploadedImages, setUploadedImages] = useState<Array<string | File>>(initialImages || []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedImages = [...uploadedImages, ...newFiles];
      setUploadedImages(updatedImages);
      
      // Apenas passar objetos File para onChange
      onChange(newFiles);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    
    // Extrair apenas os objetos File e passar para onChange
    // Isso garante que o tratamento de remoção só afete o que é necessário
    const fileObjects = updatedImages.filter(img => img instanceof File) as File[];
    onChange(fileObjects);
  };

  const renderImagePreview = (image: File | string, index: number) => {
    let imageUrl: string;
    
    if (image instanceof File) {
      imageUrl = URL.createObjectURL(image);
    } else if (typeof image === 'string') {
      // Para strings, assumir que são URLs ou caminhos de armazenamento do Supabase
      if (image.startsWith('http')) {
        imageUrl = image;
      } else {
        // Se for um caminho de armazenamento, construa o URL usando Supabase
        const { data } = supabase.storage.from('spaces').getPublicUrl(image);
        imageUrl = data.publicUrl;
      }
    } else {
      // Fallback para quaisquer outros casos
      imageUrl = '/placeholder.svg';
    }
    
    return (
      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
        <img
          src={imageUrl}
          alt={`Preview ${index}`}
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <FormSection title="Imagens">
      <div className={cn(
        "border-2 border-dashed rounded-md p-6 text-center",
        error && uploadedImages.length === 0 ? "border-destructive bg-destructive/5" : ""
      )}>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
        <label 
          htmlFor="file-upload" 
          className={cn(
            "cursor-pointer inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white",
            error && uploadedImages.length === 0 ? "bg-destructive hover:bg-destructive/90" : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          Carregar Imagens
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG, WEBP até 10MB
        </p>
        {error && uploadedImages.length === 0 && (
          <p className="text-xs text-destructive mt-2">
            Adicione pelo menos uma imagem
          </p>
        )}
      </div>

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {uploadedImages.map((file, index) => renderImagePreview(file, index))}
        </div>
      )}
    </FormSection>
  );
}
