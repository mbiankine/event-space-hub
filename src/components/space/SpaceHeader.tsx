
import React from 'react';
import { Button } from "@/components/ui/button";
import { Star, Share, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SpaceHeaderProps {
  title: string;
  location: {
    city: string;
    state: string;
  };
}

export function SpaceHeader({ title, location }: SpaceHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-current" />
          <span>4.9</span>
          <span className="mx-1">·</span>
          <span className="underline">Novo</span>
          <span className="mx-1">·</span>
          <span>{location.city}, {location.state}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="rounded-full">
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Heart className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>
    </>
  );
}
