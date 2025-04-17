
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Painel de Administração</h1>
        <p className="text-muted-foreground">Gerencie toda a plataforma EventSpace</p>
      </div>
      <Button>
        <Settings className="h-4 w-4 mr-2" />
        Configurações da Plataforma
      </Button>
    </div>
  );
};

export default DashboardHeader;
