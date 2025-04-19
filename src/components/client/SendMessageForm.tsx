
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SendMessageFormProps {
  receiverId: string;
  spaceId?: string;
  bookingId?: string;
  onMessageSent?: () => void;
  placeholder?: string;
}

export const SendMessageForm = ({ 
  receiverId, 
  spaceId, 
  bookingId, 
  onMessageSent,
  placeholder = 'Digite sua mensagem aqui...' 
}: SendMessageFormProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Por favor, digite uma mensagem antes de enviar.');
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar logado para enviar mensagens.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content: message.trim(),
        space_id: spaceId,
        booking_id: bookingId
      });
      
      if (error) throw error;
      
      toast.success('Mensagem enviada com sucesso!');
      setMessage('');
      if (onMessageSent) onMessageSent();
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem: ' + (error.message || 'Tente novamente mais tarde'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="min-h-[120px]"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading || !message.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Enviar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
