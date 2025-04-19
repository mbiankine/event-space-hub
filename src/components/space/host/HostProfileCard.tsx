
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircleUserRound } from 'lucide-react';

interface HostProfileCardProps {
  hostId: string;
  spaceTitle: string;
  hostName: string;
  onMessageClick: () => void;
}

export const HostProfileCard = ({
  hostId,
  spaceTitle,
  hostName,
  onMessageClick
}: HostProfileCardProps) => {
  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-center gap-4 mb-6">
          <CircleUserRound className="h-12 w-12" />
          <div>
            <h3 className="text-lg font-medium">{hostName}</h3>
            <p className="text-sm text-muted-foreground">Anfitrião</p>
          </div>
        </div>
        
        <Button onClick={onMessageClick} className="w-full">
          Enviar mensagem
        </Button>
      </CardContent>
    </Card>
  );
};
