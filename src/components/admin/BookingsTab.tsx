
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const BookingsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="relative grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar reservas..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <select className="border rounded p-2 text-sm">
            <option>Status: Todos</option>
            <option>Confirmadas</option>
            <option>Pendentes</option>
            <option>Canceladas</option>
          </select>
          <Button variant="outline" size="sm">Filtrar</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Cliente</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Espaço</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Data</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Valor</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 align-middle">#12345</td>
                <td className="p-4 align-middle">Maria Santos</td>
                <td className="p-4 align-middle">Salão Espaço Prime</td>
                <td className="p-4 align-middle">15/05/2023</td>
                <td className="p-4 align-middle">R$ 1.200</td>
                <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmada</span></td>
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 align-middle">#12346</td>
                <td className="p-4 align-middle">Carlos Mendes</td>
                <td className="p-4 align-middle">Casa de Campo Arvoredo</td>
                <td className="p-4 align-middle">20-22/06/2023</td>
                <td className="p-4 align-middle">R$ 4.400</td>
                <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendente</span></td>
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 align-middle">#12347</td>
                <td className="p-4 align-middle">Ana Paula</td>
                <td className="p-4 align-middle">Terraço Panorama</td>
                <td className="p-4 align-middle">10/07/2023</td>
                <td className="p-4 align-middle">R$ 800</td>
                <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelada</span></td>
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">Mostrando 3 de 942 reservas</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="bg-secondary">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Próximo</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsTab;
