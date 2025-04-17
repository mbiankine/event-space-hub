
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SendMessageForm } from './SendMessageForm';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_read: boolean;
}

interface MessagesThreadProps {
  contactId: string;
  spaceId?: string;
  bookingId?: string;
}

export const MessagesThread = ({ contactId, spaceId, bookingId }: MessagesThreadProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Construct query for messages between current user and contact
      let query = supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${contactId},receiver_id.eq.${contactId}`)
        .order('created_at', { ascending: true });
      
      // Add filters for space_id and/or booking_id if provided
      if (spaceId) {
        query = query.eq('space_id', spaceId);
      }
      
      if (bookingId) {
        query = query.eq('booking_id', bookingId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark received messages as read
      const unreadMessageIds = data
        ?.filter(msg => msg.receiver_id === user.id && !msg.is_read)
        .map(msg => msg.id) || [];
      
      if (unreadMessageIds.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessageIds);
      }

    } catch (err: any) {
      console.error('Error loading messages:', err);
      setError('Erro ao carregar mensagens. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=eq.${user?.id},receiver_id=eq.${user?.id},sender_id=eq.${contactId},receiver_id=eq.${contactId}`
        }, 
        () => loadMessages()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, contactId, spaceId, bookingId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {!isLoading && error && (
              <div className="text-center py-10 text-destructive">{error}</div>
            )}
            
            {!isLoading && !error && messages.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                Nenhuma mensagem encontrada. Inicie uma conversa!
              </div>
            )}
            
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.sender_id === user?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === user?.id 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {formatMessageDate(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
      
      <SendMessageForm 
        receiverId={contactId}
        spaceId={spaceId}
        bookingId={bookingId}
        onMessageSent={loadMessages}
      />
    </div>
  );
};
