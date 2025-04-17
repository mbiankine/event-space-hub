
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingConfirmationViewProps {
  watch: any;
  space: any;
  isProcessingPayment: boolean;
  onProceedToPayment: () => void;
}

export function BookingConfirmationView({
  watch,
  space,
  isProcessingPayment,
  onProceedToPayment
}: BookingConfirmationViewProps) {
  // Calculate correct total price based on booking type
  const getTotalPrice = () => {
    if (watch.bookingType === 'hourly') {
      return (space.hourly_price || 0) * watch.hours;
    } else {
      return space.price * (watch.days || 1);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-900">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Check className="h-5 w-5" />
          <p className="text-sm font-medium">Pré-reserva criada com sucesso!</p>
        </div>
        <p className="text-sm text-green-600 dark:text-green-500 mt-1">
          Confirme os detalhes abaixo e prossiga para o pagamento.
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Espaço:</h4>
            <p className="font-medium">{space.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Data:</h4>
            <p className="font-medium">
              {watch.date ? format(watch.date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : ''}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Convidados:</h4>
            <p className="font-medium">{watch.guests}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Duração:</h4>
            <p className="font-medium">
              {watch.bookingType === 'hourly'
                ? `${watch.hours} ${watch.hours > 1 ? 'horas' : 'hora'}`
                : `${watch.days} ${watch.days > 1 ? 'dias' : 'dia'}`}
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Evento:</h4>
          <p className="font-medium">{watch.eventType}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Nome:</h4>
          <p className="font-medium">{watch.name}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Email:</h4>
          <p className="font-medium">{watch.email}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Telefone:</h4>
          <p className="font-medium">{watch.phone}</p>
        </div>
        
        {watch.notes && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Observações:</h4>
            <p className="font-medium">{watch.notes}</p>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>
          R$ {getTotalPrice().toFixed(2)}
        </span>
      </div>

      <div className="mt-4">
        <Button 
          onClick={onProceedToPayment}
          disabled={isProcessingPayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Redirecionando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Prosseguir para Pagamento
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
