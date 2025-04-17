
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, Tooltip } from "recharts";

const data = [
  { mes: 'Jan', reservas: 4, receita: 4800 },
  { mes: 'Fev', reservas: 3, receita: 3600 },
  { mes: 'Mar', reservas: 5, receita: 6000 },
  { mes: 'Abr', reservas: 7, receita: 8400 },
  { mes: 'Mai', reservas: 6, receita: 7200 },
  { mes: 'Jun', reservas: 8, receita: 9600 },
];

export const AnalyticsContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho Mensal</CardTitle>
        <CardDescription>Monitoramento das reservas e receita</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="mes" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="reservas" fill="#8884d8" name="Reservas" />
            <Bar yAxisId="right" dataKey="receita" fill="#82ca9d" name="Receita (R$)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
