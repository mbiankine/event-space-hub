
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const AnalyticsContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho Mensal</CardTitle>
        <CardDescription>Monitoramento das reservas e receita</CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
          <BarChart3 className="h-8 w-8 mb-2" />
          <p>Gráfico de Desempenho Mensal</p>
        </div>
      </CardContent>
    </Card>
  );
};
