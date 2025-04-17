
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface BookingStatusActionsProps {
  booking: {
    id: string;
    status: string;
  };
  user: User | null;
  onStatusUpdate: (newStatus: string) => void;
}

const BookingStatusActions = ({ booking, user, onStatusUpdate }: BookingStatusActionsProps) => {
  const handleUpdateStatus = async (newStatus: string) => {
    if (!booking || !user) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id)
        .eq('host_id', user.id);

      if (error) throw error;

      onStatusUpdate(newStatus);
      toast.success(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'atualizada'} com sucesso`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Erro ao atualizar status da reserva');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
      {booking.status === 'pending' && (
        <Button variant="default" onClick={() => handleUpdateStatus('confirmed')}>
          Confirmar Reserva
        </Button>
      )}

      {booking.status === 'confirmed' && (
        <Button variant="default" onClick={() => handleUpdateStatus('completed')}>
          Marcar como Concluída
        </Button>
      )}

      {(booking.status === 'pending' || booking.status === 'confirmed') && (
        <Button variant="destructive" onClick={() => handleUpdateStatus('cancelled')}>
          Cancelar
        </Button>
      )}
    </div>
  );
};

export default BookingStatusActions;
