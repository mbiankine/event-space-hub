
import React from 'react';
import { Space } from '@/types/SpaceTypes';
import { SpaceCard } from '@/components/host/SpaceCard';

interface SpacesGridProps {
  spaces: Space[];
  onDelete: (id: string) => void;
}

export const SpacesGrid = ({ spaces, onDelete }: SpacesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spaces.map((space) => (
        <SpaceCard 
          key={space.id} 
          space={space} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};
