
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Calendar, Eye } from "lucide-react";
import { Space } from '@/types/SpaceTypes';
import { supabase } from '@/integrations/supabase/client';

interface SpaceCardProps {
  space: Space;
  onDelete: (id: string) => void;
}

export const SpaceCard = ({ space, onDelete }: SpaceCardProps) => {
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
        <p className="text-sm font-medium">
          {space.pricing_type === 'both' || space.pricing_type === 'daily' 
            ? `R$ ${space.price?.toFixed(2)} / diária` 
            : ''}
        </p>
        {(space.pricing_type === 'both' || space.pricing_type === 'hourly') && space.hourly_price && (
          <p className="text-sm font-medium">
            R$ {space.hourly_price?.toFixed(2)} / hora
          </p>
        )}
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
              <AlertDialogAction onClick={() => onDelete(space.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
