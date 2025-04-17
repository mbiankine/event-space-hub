
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStatsProps {
  stats: {
    totalSpaces: number;
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Receita Total</CardDescription>
          <CardTitle className="text-2xl">R$ {stats.totalRevenue.toLocaleString('pt-BR')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="ml-1">que o mês passado</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Reservas este mês</CardDescription>
          <CardTitle className="text-2xl">{stats.totalBookings}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">8%</span>
            <span className="ml-1">que o mês passado</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total de Espaços</CardDescription>
          <CardTitle className="text-2xl">{stats.totalSpaces}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <Link to="/host/spaces" className="text-primary hover:underline">
              Gerenciar espaços
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Classificação média</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {stats.averageRating}
            <Star className="h-4 w-4 ml-1 fill-current text-yellow-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Baseada em 32 avaliações
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
