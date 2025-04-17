
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Space } from '@/hooks/useAdminDashboard';
import { formatCurrency } from '@/lib/utils';

interface SpacesTabProps {
  spaces: Space[];
}

const SpacesTab = ({ spaces }: SpacesTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSpaces = spaces.filter(space => {
    // Filter by search term
    const matchesSearch = 
      searchTerm === '' || 
      space.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${space.location.city} ${space.location.state}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type - assuming we'd have a spaceType field
    const matchesType = typeFilter === 'all';
    
    // Filter by status
    const matchesStatus = 
      statusFilter === 'all' || 
      space.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="relative grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar espaços..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="border rounded p-2 text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Todos os tipos</option>
            <option value="salao">Salões</option>
            <option value="casa">Casas</option>
            <option value="espaco">Espaços ao ar livre</option>
          </select>
          <select 
            className="border rounded p-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Status: Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
            <option value="revisao">Em revisão</option>
          </select>
          <Button variant="outline" size="sm">Filtrar</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Anfitrião</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpaces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhum espaço encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredSpaces.map((space) => (
                <TableRow key={space.id} className="border-b">
                  <TableCell>{space.title}</TableCell>
                  <TableCell>{space.host_name}</TableCell>
                  <TableCell>{`${space.location.city}, ${space.location.state}`}</TableCell>
                  <TableCell>{space.capacity}</TableCell>
                  <TableCell>{formatCurrency(space.price)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      space.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                      space.status === 'Em revisão' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {space.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredSpaces.length} de {spaces.length} espaços
          </div>
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

export default SpacesTab;
