
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  userName: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">
          Olá, {userName}
        </h1>
        <p className="text-muted-foreground">Gerencie suas reservas e preferências</p>
      </div>
      <Button asChild>
        <Link to="/">Procurar novos espaços</Link>
      </Button>
    </div>
  );
};
