
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BookingNotFound = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-2">Reserva não encontrada</h2>
      <p className="text-muted-foreground mb-4">A reserva solicitada não foi encontrada.</p>
      <Button asChild>
        <Link to="/client/dashboard">Voltar para o Dashboard</Link>
      </Button>
    </div>
  );
};

export default BookingNotFound;
