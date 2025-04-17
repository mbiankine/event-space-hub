
import React, { useEffect, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentDetailsProps {
  booking: {
    id: string;
    space_price: number | null;
    additional_services_price: number | null;
    service_fee: number | null;
    total_price: number | null;
    payment_status: string | null;
    payment_method?: string;
    status: string | null;
  };
}

const PaymentDetails = ({ booking }: PaymentDetailsProps) => {
  const [updatedBooking, setUpdatedBooking] = useState(booking);

  useEffect(() => {
    console.log('Setting up booking status updates for booking:', booking.id);
    
    // Set up real-time subscription for booking updates
    const channel = supabase
      .channel('booking-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${booking.id}`
      }, (payload) => {
        console.log('Realtime booking update received:', payload);
        setUpdatedBooking(prevState => ({
          ...prevState,
          payment_status: payload.new.payment_status,
          status: payload.new.status,
          payment_method: payload.new.payment_method
        }));
        
        if (payload.new.payment_status === 'paid') {
          toast.success('Pagamento confirmado com sucesso!');
        }
      })
      .subscribe();

    // Initial fetch to ensure we have the latest data
    const fetchLatestBookingData = async () => {
      console.log('Fetching latest booking data...');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', booking.id)
        .maybeSingle();

      if (!error && data) {
        console.log('Initial fetch result:', data);
        setUpdatedBooking(prevState => ({
          ...prevState,
          payment_status: data.payment_status,
          status: data.status,
          payment_method: data.payment_method
        }));
      } else if (error) {
        console.error('Error fetching booking:', error);
      }
    };
    
    fetchLatestBookingData();

    // Set up polling every minute as a backup
    const pollInterval = setInterval(async () => {
      console.log('Polling booking status...');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', booking.id)
        .maybeSingle();

      if (!error && data) {
        console.log('Polling update result:', data);
        setUpdatedBooking(prevState => ({
          ...prevState,
          payment_status: data.payment_status,
          status: data.status,
          payment_method: data.payment_method
        }));
      }
    }, 60000); // 1 minute interval

    // Cleanup subscriptions and intervals
    return () => {
      console.log('Cleaning up booking status update subscriptions');
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [booking.id]);

  // Update the local state when the prop changes
  useEffect(() => {
    setUpdatedBooking(booking);
  }, [booking]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPaymentStatusBadge = (status: string | null) => {
    if (!status || status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
    }
    
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pago</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Falhou</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
    }
  };

  const getBookingStatusBadge = (status: string | null) => {
    if (!status || status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
    }
    
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Confirmado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
    }
  };

  const getPaymentMethodText = (method: string | null | undefined) => {
    if (!method) return 'Não informado';
    
    switch (method.toLowerCase()) {
      case 'card':
        return 'Cartão de crédito';
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto';
      default:
        return method;
    }
  };

  return (
    <CardContent>
      <div className="space-y-2">
        <h3 className="font-medium">Detalhes do Pagamento</h3>
        <div className="flex justify-between">
          <span>Valor do espaço</span>
          <span>{updatedBooking.space_price ? formatCurrency(updatedBooking.space_price) : '-'}</span>
        </div>
        {updatedBooking.additional_services_price > 0 && (
          <div className="flex justify-between">
            <span>Serviços adicionais</span>
            <span>{formatCurrency(updatedBooking.additional_services_price)}</span>
          </div>
        )}
        {updatedBooking.service_fee > 0 && (
          <div className="flex justify-between">
            <span>Taxa de serviço</span>
            <span>{formatCurrency(updatedBooking.service_fee)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Forma de pagamento</span>
          <span>{getPaymentMethodText(updatedBooking.payment_method)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status do Pagamento</span>
          <span className="inline-flex items-center">
            {getPaymentStatusBadge(updatedBooking.payment_status)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status da Reserva</span>
          <span className="inline-flex items-center">
            {getBookingStatusBadge(updatedBooking.status)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{updatedBooking.total_price ? formatCurrency(updatedBooking.total_price) : '-'}</span>
        </div>
      </div>
    </CardContent>
  );
};

export default PaymentDetails;
