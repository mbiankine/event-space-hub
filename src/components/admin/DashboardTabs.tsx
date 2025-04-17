
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersTab from './UsersTab';
import SpacesTab from './SpacesTab';
import BookingsTab from './BookingsTab';
import ReportsTab from './ReportsTab';

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="users" className="mb-8">
      <TabsList>
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="spaces">Espaços</TabsTrigger>
        <TabsTrigger value="bookings">Reservas</TabsTrigger>
        <TabsTrigger value="reports">Relatórios</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-6 mt-6">
        <UsersTab />
      </TabsContent>

      <TabsContent value="spaces" className="space-y-6 mt-6">
        <SpacesTab />
      </TabsContent>

      <TabsContent value="bookings" className="space-y-6 mt-6">
        <BookingsTab />
      </TabsContent>

      <TabsContent value="reports" className="space-y-6 mt-6">
        <ReportsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
