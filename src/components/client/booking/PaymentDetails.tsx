
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentDetailsProps {
  booking: {
    space_price: number | null;
    additional_services_price: number | null;
    service_fee: number | null;
    total_price: number | null;
    payment_status: string;
    payment_method?: string;
    status: string | null;
  };
}

const PaymentDetails = ({ booking }: PaymentDetailsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pago</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
    }
  };

  const getBookingStatusBadge = (status: string | null) => {
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
          <span>{booking.space_price ? formatCurrency(booking.space_price) : '-'}</span>
        </div>
        {booking.additional_services_price > 0 && (
          <div className="flex justify-between">
            <span>Serviços adicionais</span>
            <span>{formatCurrency(booking.additional_services_price)}</span>
          </div>
        )}
        {booking.service_fee > 0 && (
          <div className="flex justify-between">
            <span>Taxa de serviço</span>
            <span>{formatCurrency(booking.service_fee)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Forma de pagamento</span>
          <span>{getPaymentMethodText(booking.payment_method)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status do Pagamento</span>
          <span className="inline-flex items-center">
            {getPaymentStatusBadge(booking.payment_status)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status da Reserva</span>
          <span className="inline-flex items-center">
            {getBookingStatusBadge(booking.status)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{booking.total_price ? formatCurrency(booking.total_price) : '-'}</span>
        </div>
      </div>
    </CardContent>
  );
};

export default PaymentDetails;
