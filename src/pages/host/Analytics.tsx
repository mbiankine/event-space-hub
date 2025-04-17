
import React from 'react';
import { HostLayout } from '@/components/layouts/HostLayout';
import { AnalyticsContent } from '@/components/host/AnalyticsContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const revenueData = [
  { mes: 'Jan', receita: 4800 },
  { mes: 'Fev', receita: 3600 },
  { mes: 'Mar', receita: 6000 },
  { mes: 'Abr', receita: 8400 },
  { mes: 'Mai', receita: 7200 },
  { mes: 'Jun', receita: 9600 },
];

const bookingsData = [
  { mes: 'Jan', reservas: 4 },
  { mes: 'Fev', reservas: 3 },
  { mes: 'Mar', reservas: 5 },
  { mes: 'Abr', reservas: 7 },
  { mes: 'Mai', reservas: 6 },
  { mes: 'Jun', reservas: 8 },
];

const eventTypeData = [
  { name: "Festas", value: 35 },
  { name: "Empresarial", value: 25 },
  { name: "Casamento", value: 20 },
  { name: "Outros", value: 20 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const Analytics = () => {
  return (
    <HostLayout 
      title="Análise de Desempenho" 
      description="Acompanhe o desempenho dos seus espaços e reservas"
    >
      <div className="space-y-6 text-left">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receita Mensal</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`R$ ${value}`, 'Receita']}
                        labelFormatter={(label) => `Mês: ${label}`}
                      />
                      <Line type="monotone" dataKey="receita" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Eventos</CardTitle>
                  <CardDescription>Distribuição por categoria</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {eventTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Receita Detalhada</CardTitle>
                <CardDescription>Análise de receita mensal</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`R$ ${value}`, 'Receita']}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Bar dataKey="receita" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Reservas por Mês</CardTitle>
                <CardDescription>Número de reservas confirmadas</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, 'Reservas']}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Bar dataKey="reservas" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HostLayout>
  );
};

export default Analytics;
