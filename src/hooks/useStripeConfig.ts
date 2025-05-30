
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth/AuthContext';

export function useStripeConfig() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  async function startStripeCheckout(spaceId: string, price: number, days?: number, bookingId?: string) {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error('Você precisa estar logado para continuar');
        return false;
      }
      
      console.log(`Starting checkout for space: ${spaceId}, price: ${price}, days: ${days}, booking: ${bookingId}`);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          space_id: spaceId, 
          price,
          user_id: user.id,
          user_email: user.email,
          days,
          booking_id: bookingId
        }
      });
      
      if (error) {
        console.error("Checkout error from function:", error);
        throw error;
      }
      
      if (data?.url) {
        // Show a toast notification before redirecting
        toast.info('Redirecionando para o checkout...');
        console.log("Redirecting to Stripe URL:", data.url);
        
        // Small timeout to allow toast to show before redirecting
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
        
        return true;
      } else {
        console.error("No checkout URL returned:", data);
        throw new Error('Não foi possível iniciar o checkout');
      }
      
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      toast.error('Erro no Checkout', {
        description: error.message || 'Falha ao iniciar o pagamento'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { 
    startStripeCheckout,
    isLoading
  };
}
