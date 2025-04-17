
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const UsersTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="relative grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar usuários..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <select className="border rounded p-2 text-sm">
            <option>Todos os tipos</option>
            <option>Clientes</option>
            <option>Anfitriões</option>
            <option>Administradores</option>
          </select>
          <select className="border rounded p-2 text-sm">
            <option>Status: Todos</option>
            <option>Ativos</option>
            <option>Inativos</option>
            <option>Pendentes</option>
          </select>
          <Button variant="outline" size="sm">Filtrar</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Tipo</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Registro</th>
                <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 align-middle">João Silva</td>
                <td className="p-4 align-middle">joao@email.com</td>
                <td className="p-4 align-middle">Cliente</td>
                <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span></td>
                <td className="p-4 align-middle">10/01/2023</td>
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 align-middle">Ana Martins</td>
                <td className="p-4 align-middle">ana@email.com</td>
                <td className="p-4 align-middle">Anfitrião</td>
                <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span></td>
                <td className="p-4 align-middle">05/03/2019</td>
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 align-middle">Carlos Mendes</td>
                <td className="p-4 align-middle">carlos@email.com</td>
                <td className="p-4 align-middle">Cliente</td>
                <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendente</span></td>
                <td className="p-4 align-middle">22/04/2023</td>
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 align-middle">Roberto Alves</td>
                <td className="p-4 align-middle">roberto@email.com</td>
                <td className="p-4 align-middle">Administrador</td>
                <td className="p-4 align-middle"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span></td>
                <td className="p-4 align-middle">15/01/2023</td>
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">Mostrando 4 de 3,487 usuários</div>
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

export default UsersTab;
