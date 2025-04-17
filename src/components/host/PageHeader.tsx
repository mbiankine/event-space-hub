
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PageHeaderProps {
  onAddClick: () => void;
}

export const PageHeader = ({ onAddClick }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-1 text-left">Meus Espaços</h1>
        <p className="text-muted-foreground text-left">Gerencie seus espaços para eventos</p>
      </div>
      <Button onClick={onAddClick} className="mt-4 md:mt-0">
        <PlusCircle className="h-4 w-4 mr-2" />
        Adicionar novo espaço
      </Button>
    </div>
  );
};
