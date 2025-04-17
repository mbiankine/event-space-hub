
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export function useStripeConfig() {
  const [isLoading, setIsLoading] = useState(false);

  async function startStripeCheckout(spaceId: string, price: number, days?: number) {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          space_id: spaceId, 
          price, 
          days 
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        // Show a toast notification before redirecting
        toast.info('Redirecionando para o checkout...');
        
        // Small timeout to allow toast to show before redirecting
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
        
        return true;
      } else {
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
