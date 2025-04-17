
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare, 
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Booking } from "@/types/BookingTypes";

const BookingStatus = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmado";
      case "cancelled":
        return "Cancelado";
      case "completed":
        return "Concluído";
      default:
        return "Desconhecido";
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
};

const HostBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        // Get total count for pagination
        const { count, error: countError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('host_id', user.id);
          
        if (countError) throw countError;
        
        // Get paginated data
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('host_id', user.id)
          .order('booking_date', { ascending: false })
          .range(from, to);
          
        if (error) throw error;
        
        setBookings(data as Booking[] || []);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Erro ao carregar reservas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, page]);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      
      toast.success(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'atualizada'} com sucesso`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Erro ao atualizar status da reserva');
    }
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Format date function to replace date-fns
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Reservas</h1>
            <p className="text-muted-foreground">Gerencie todas as reservas para seus espaços</p>
          </div>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Ver calendário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas as Reservas</CardTitle>
            <CardDescription>Gerencie e acompanhe o status das suas reservas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Você ainda não possui reservas</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Espaço</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.space_title || "Espaço"}</TableCell>
                          <TableCell>{booking.client_name || "Cliente"}</TableCell>
                          <TableCell>
                            {booking.booking_date ? formatDate(booking.booking_date) : "--/--/----"}
                          </TableCell>
                          <TableCell>R$ {booking.total_price?.toFixed(2) || "0,00"}</TableCell>
                          <TableCell>
                            <BookingStatus status={booking.status || "pending"} />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/host/bookings/${booking.id}`}>Ver detalhes</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={`/host/bookings/${booking.id}/messages`}>
                                    <MessageSquare className="h-4 w-4 mr-2" /> Mensagens
                                  </Link>
                                </DropdownMenuItem>
                                {booking.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "confirmed")}>
                                    Confirmar reserva
                                  </DropdownMenuItem>
                                )}
                                {booking.status === "confirmed" && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "completed")}>
                                    Marcar como concluída
                                  </DropdownMenuItem>
                                )}
                                {(booking.status === "pending" || booking.status === "confirmed") && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "cancelled")}>
                                    Cancelar reserva
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    <div className="text-sm mx-4">
                      Página {page} de {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={page === totalPages}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default HostBookings;
