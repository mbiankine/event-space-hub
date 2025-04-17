
import { useState } from 'react';
import { X } from 'lucide-react';
import { FormSection } from './FormSection';

interface ImageUploadSectionProps {
  onChange: (images: File[]) => void;
  initialImages?: File[];
}

export function ImageUploadSection({ onChange, initialImages = [] }: ImageUploadSectionProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>(initialImages);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedImages = [...uploadedImages, ...newFiles];
      setUploadedImages(updatedImages);
      onChange(updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <FormSection title="Imagens">
      <div className="border-2 border-dashed rounded-md p-6 text-center">
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
          className="cursor-pointer inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Carregar Imagens
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG, WEBP até 10MB
        </p>
      </div>

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {uploadedImages.map((file, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
              <img
                src={URL.createObjectURL(file)}
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
          ))}
        </div>
      )}
    </FormSection>
  );
}
