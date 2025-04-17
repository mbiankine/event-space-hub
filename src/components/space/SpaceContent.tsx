
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { SpaceAmenities } from "@/components/space/SpaceAmenities";
import { HostProfileCard } from "@/components/space/host/HostProfileCard";

interface SpaceContentProps {
  space: any;
  onMessageClick: () => void;
}

export function SpaceContent({ space, onMessageClick }: SpaceContentProps) {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Espaço inteiro hospedado por Anfitrião</h2>
          <p className="text-muted-foreground">
            Até {space.capacity} pessoas
          </p>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sobre o espaço</h3>
        <p className="text-muted-foreground">{space.description}</p>
      </div>
      
      <Separator className="my-6" />
      
      <SpaceAmenities amenities={space.amenities || []} />
      
      <Separator className="my-6" />
      
      <HostProfileCard
        hostId={space.host_id}
        spaceTitle={space.title}
        hostName="Anfitrião"
        rating={4.99}
        reviewCount={89}
        yearsHosting={4}
        responseRate={100}
        responseTime="1 hora"
        coHosts={[
          { id: '1', name: 'Pedro Müller' },
          { id: '2', name: 'Marcia' }
        ]}
        onMessageClick={onMessageClick}
      />
    </div>
  );
}
