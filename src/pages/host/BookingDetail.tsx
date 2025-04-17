
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [space, setSpace] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    
    const fetchBookingDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch booking
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .eq('host_id', user.id)
          .single();
          
        if (bookingError) throw bookingError;
        if (!bookingData) {
          toast.error('Reserva não encontrada');
          navigate('/host/bookings');
          return;
        }
        
        setBooking(bookingData);
        
        // Fetch space
        if (bookingData.space_id) {
          const { data: spaceData } = await supabase
            .from('spaces')
            .select('*')
            .eq('id', bookingData.space_id)
            .single();
            
          setSpace(spaceData);
        }
        
        // Fetch client
        if (bookingData.client_id) {
          const { data: clientData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', bookingData.client_id)
            .single();
            
          setClient(clientData);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Erro ao carregar detalhes da reserva');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [user, id, navigate]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setBooking({ ...booking, status: newStatus });
      toast.success(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'atualizada'} com sucesso`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Erro ao atualizar status da reserva');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string, className: string }> = {
      pending: { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Confirmada', className: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Cancelada', className: 'bg-red-100 text-red-800' },
      completed: { text: 'Concluída', className: 'bg-blue-100 text-blue-800' },
    };
    
    const statusInfo = statusMap[status] || { text: 'Desconhecido', className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/host/bookings')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para reservas
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl font-bold">Detalhes da Reserva</h1>
            {booking && (
              <div className="mt-2 md:mt-0">
                {getStatusBadge(booking.status || 'pending')}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : booking ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Reserva</CardTitle>
                  <CardDescription>Detalhes do evento e reserva</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Espaço</h3>
                      <p className="text-lg font-medium">{space?.title || booking.space_title || "Espaço"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Tipo de Evento</h3>
                      <p>{booking.event_type || "Não especificado"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Data</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {booking.booking_date ? 
                            format(new Date(booking.booking_date), "dd 'de' MMMM 'de' yyyy", {locale: ptBR}) : 
                            "Não especificada"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Horário</h3>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{booking.start_time || "--:--"} - {booking.end_time || "--:--"}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Convidados</h3>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{booking.guest_count || 0} pessoas</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Data da Reserva</h3>
                      <p>
                        {booking.created_at ? 
                          format(new Date(booking.created_at), "dd/MM/yyyy", {locale: ptBR}) : 
                          "--/--/----"}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Observações</h3>
                    <p className="text-sm">{booking.notes || "Nenhuma observação adicionada."}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Localização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <p>{space?.address || "Endereço não disponível"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor do espaço</span>
                      <span>R$ {booking.space_price?.toFixed(2) || "0,00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serviços adicionais</span>
                      <span>R$ {booking.additional_services_price?.toFixed(2) || "0,00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxa de serviço</span>
                      <span>R$ {booking.service_fee?.toFixed(2) || "0,00"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Valor total</span>
                      <span>R$ {booking.total_price?.toFixed(2) || "0,00"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status do pagamento</span>
                      <span className="font-medium text-green-600">
                        {booking.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{client?.full_name || booking.client_name || "Cliente"}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{client?.username || booking.client_email || "Email não disponível"}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{booking.client_phone || "Telefone não disponível"}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mensagem para o cliente
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {booking.status === "pending" && (
                    <Button onClick={() => handleUpdateStatus("confirmed")} className="w-full">
                      Confirmar reserva
                    </Button>
                  )}
                  {booking.status === "confirmed" && (
                    <Button onClick={() => handleUpdateStatus("completed")} className="w-full">
                      Marcar como concluída
                    </Button>
                  )}
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <Button 
                      onClick={() => handleUpdateStatus("cancelled")} 
                      variant="outline" 
                      className="w-full text-destructive hover:text-destructive"
                    >
                      Cancelar reserva
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar recibo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Reserva não encontrada</p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetail;
