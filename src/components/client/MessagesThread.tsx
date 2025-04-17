
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SendMessageForm } from './SendMessageForm';
import { MessagesContainer } from '@/components/messages/MessagesContainer';

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

      let query = supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${contactId},receiver_id.eq.${contactId}`)
        .order('created_at', { ascending: true });
      
      if (spaceId) {
        query = query.eq('space_id', spaceId);
      }
      
      if (bookingId) {
        query = query.eq('booking_id', bookingId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setMessages(data || []);
      
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
            <MessagesContainer
              messages={messages}
              isLoading={isLoading}
              error={error}
              currentUserId={user?.id || ''}
            />
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
