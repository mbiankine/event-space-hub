
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Users, Building2, DollarSign } from 'lucide-react';

const ReportsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Acompanhamento financeiro</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <BarChart3 className="h-8 w-8 mb-2" />
              <p>Gráfico de Receita</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novos Usuários</CardTitle>
            <CardDescription>Crescimento da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <Users className="h-8 w-8 mb-2" />
              <p>Gráfico de Crescimento</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Espaços por Região</CardTitle>
            <CardDescription>Distribuição geográfica</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <Building2 className="h-8 w-8 mb-2" />
              <p>Gráfico de Distribuição</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
            <CardDescription>Visitas vs. Reservas</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <DollarSign className="h-8 w-8 mb-2" />
              <p>Gráfico de Conversão</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsTab;
