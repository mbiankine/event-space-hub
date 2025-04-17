
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2, CheckCircle, Shield } from 'lucide-react';

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Acesso rápido às principais funções administrativas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto flex-col py-4 px-6 justify-start items-start">
            <User className="h-8 w-8 mb-2" />
            <span className="font-medium">Adicionar Usuário</span>
            <span className="text-xs text-muted-foreground mt-1">Criar nova conta</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col py-4 px-6 justify-start items-start">
            <Building2 className="h-8 w-8 mb-2" />
            <span className="font-medium">Aprovar Espaços</span>
            <span className="text-xs text-muted-foreground mt-1">5 pendentes</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col py-4 px-6 justify-start items-start">
            <CheckCircle className="h-8 w-8 mb-2" />
            <span className="font-medium">Verificar Anfitriões</span>
            <span className="text-xs text-muted-foreground mt-1">8 pendentes</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col py-4 px-6 justify-start items-start">
            <Shield className="h-8 w-8 mb-2" />
            <span className="font-medium">Moderar Avaliações</span>
            <span className="text-xs text-muted-foreground mt-1">12 pendentes</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
