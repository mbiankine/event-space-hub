
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardStatsProps {
  totalUsers: number;
  totalSpaces: number;
  totalBookings: number;
  totalRevenue: number;
}

const DashboardStats = ({ 
  totalUsers, 
  totalSpaces, 
  totalBookings, 
  totalRevenue 
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total de Usuários</CardDescription>
          <CardTitle className="text-2xl">{totalUsers.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">15%</span>
            <span className="ml-1">este mês</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Espaços Ativos</CardDescription>
          <CardTitle className="text-2xl">{totalSpaces.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">8%</span>
            <span className="ml-1">este mês</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Reservas este mês</CardDescription>
          <CardTitle className="text-2xl">{totalBookings.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="ml-1">vs. mês anterior</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Receita Total</CardDescription>
          <CardTitle className="text-2xl">{formatCurrency(totalRevenue)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">18%</span>
            <span className="ml-1">vs. mês anterior</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
