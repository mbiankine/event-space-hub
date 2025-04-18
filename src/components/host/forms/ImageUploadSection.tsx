
import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Effect to sync the initial images when they change (like when form is reset)
  useEffect(() => {
    setUploadedImages(initialImages || []);
    // If we have initial images, consider it a success state
    if (initialImages && initialImages.length > 0) {
      setUploadSuccess(true);
    }
  }, [initialImages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      const newFiles = Array.from(e.target.files);
      const updatedImages = [...uploadedImages, ...newFiles];
      setUploadedImages(updatedImages);
      
      // Get all File objects from the updated images array
      const fileObjects = updatedImages.filter(img => img instanceof File) as File[];
      
      // Pass all files to onChange, not just the new ones
      onChange(fileObjects);

      // Simulate upload completion (in real world this would be after actual upload)
      setTimeout(() => {
        setIsLoading(false);
        setUploadSuccess(true);
      }, 500);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    
    // Extract only File objects and pass to onChange
    const fileObjects = updatedImages.filter(img => img instanceof File) as File[];
    onChange(fileObjects);

    // Update success state based on remaining images
    if (updatedImages.length === 0) {
      setUploadSuccess(false);
    }
  };

  const renderImagePreview = (image: File | string, index: number) => {
    let imageUrl: string;
    
    if (image instanceof File) {
      imageUrl = URL.createObjectURL(image);
    } else if (typeof image === 'string') {
      // For strings, assume they are URLs or Supabase storage paths
      if (image.startsWith('http')) {
        imageUrl = image;
      } else {
        // If it's a storage path, build the URL using Supabase
        const { data } = supabase.storage.from('spaces').getPublicUrl(image);
        imageUrl = data.publicUrl;
      }
    } else {
      // Fallback for any other cases
      imageUrl = '/placeholder.svg';
    }
    
    return (
      <div key={index} className="relative aspect-square rounded-md overflow-hidden border group">
        <img
          src={imageUrl}
          alt={`Preview ${index}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="p-1 rounded-full bg-white/80 hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <FormSection title="Imagens">
      <div className={cn(
        "border-2 border-dashed rounded-md p-6 text-center",
        error && uploadedImages.length === 0 ? "border-destructive bg-destructive/5" : 
        uploadSuccess && !error ? "border-green-500 bg-green-50" : ""
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
            error && uploadedImages.length === 0 ? "bg-destructive hover:bg-destructive/90" : 
            "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            <>Carregar Imagens</>
          )}
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG, WEBP até 10MB
        </p>
        {uploadSuccess && uploadedImages.length > 0 && !error && (
          <div className="flex items-center justify-center mt-2 text-green-600">
            <Check className="w-4 h-4 mr-1" />
            <span className="text-xs">{uploadedImages.length} {uploadedImages.length === 1 ? 'imagem carregada' : 'imagens carregadas'}</span>
          </div>
        )}
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
