
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface EmptyStateCardProps {
  onAddClick: () => void;
}

export const EmptyStateCard = ({ onAddClick }: EmptyStateCardProps) => {
  return (
    <Card className="text-center p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-primary/10 p-6">
          <PlusCircle className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Nenhum espaço encontrado</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Você ainda não possui espaços publicados. Comece adicionando seu primeiro espaço para eventos.
        </p>
        <Button onClick={onAddClick}>
          Adicionar meu primeiro espaço
        </Button>
      </div>
    </Card>
  );
};
