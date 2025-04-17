
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
import { Booking } from '@/hooks/useAdminDashboard';
import { formatCurrency, formatDate } from '@/lib/utils';

interface BookingsTabProps {
  bookings: Booking[];
}

const BookingsTab = ({ bookings }: BookingsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    // Filter by search term
    const matchesSearch = 
      searchTerm === '' || 
      booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.space_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = 
      statusFilter === 'all' || 
      booking.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="relative grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar reservas..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="border rounded p-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Status: Todos</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendente">Pendentes</option>
            <option value="cancelada">Canceladas</option>
          </select>
          <Button variant="outline" size="sm">Filtrar</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Espaço</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhuma reserva encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="border-b">
                  <TableCell>#{booking.id.substring(0, 5)}</TableCell>
                  <TableCell>{booking.client_name}</TableCell>
                  <TableCell>{booking.space_title}</TableCell>
                  <TableCell>{formatDate(booking.booking_date)}</TableCell>
                  <TableCell>{formatCurrency(booking.total_price)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmada' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status === 'confirmada' ? 'Confirmada' : 
                       booking.status === 'pendente' ? 'Pendente' : 'Cancelada'}
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
            Mostrando {filteredBookings.length} de {bookings.length} reservas
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

export default BookingsTab;
