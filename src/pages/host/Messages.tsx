
import React, { useState, useEffect } from 'react';
import { HostLayout } from '@/components/layouts/HostLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/host/LoadingState';
import { Send, Search } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// This is a placeholder interface - will need to be updated when you add real messaging functionality
interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sender_name: string;
  created_at: string;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar_url?: string;
  last_message?: string;
  unread_count: number;
}

const Messages = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Simulating fetching contacts
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with real data from Supabase when ready
        setTimeout(() => {
          const mockContacts: Contact[] = [
            {
              id: '1',
              name: 'João Silva',
              last_message: 'Olá, estou interessado no espaço para um evento.',
              unread_count: 2
            },
            {
              id: '2',
              name: 'Maria Oliveira',
              last_message: 'Qual o valor para aluguel no próximo sábado?',
              unread_count: 0
            },
            {
              id: '3',
              name: 'Carlos Santos',
              last_message: 'Obrigado pela informação.',
              unread_count: 1
            }
          ];
          setContacts(mockContacts);
          setIsLoading(false);
        }, 1000);
      } catch (error: any) {
        console.error('Error fetching contacts:', error);
        toast.error('Erro ao carregar contatos');
        setIsLoading(false);
      }
    };

    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchMessages = (contactId: string) => {
    // Mock data - replace with real data from Supabase when ready
    const mockMessages: Message[] = [
      {
        id: '1',
        sender_id: contactId,
        receiver_id: user?.id || '',
        content: 'Olá, estou interessado no espaço para um evento.',
        sender_name: 'João Silva',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        read: true
      },
      {
        id: '2',
        sender_id: user?.id || '',
        receiver_id: contactId,
        content: 'Olá! Claro, qual data você está interessado?',
        sender_name: 'Você',
        created_at: new Date(Date.now() - 3500000).toISOString(),
        read: true
      },
      {
        id: '3',
        sender_id: contactId,
        receiver_id: user?.id || '',
        content: 'Estou pensando no próximo final de semana.',
        sender_name: 'João Silva',
        created_at: new Date(Date.now() - 3400000).toISOString(),
        read: true
      }
    ];
    setMessages(mockMessages);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    fetchMessages(contact.id);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    // Add message to UI
    const newMsg: Message = {
      id: Date.now().toString(),
      sender_id: user?.id || '',
      receiver_id: selectedContact.id,
      content: newMessage,
      sender_name: 'Você',
      created_at: new Date().toISOString(),
      read: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Here you would send the message to Supabase
    // When implemented, this function would create a new message in your database
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <HostLayout
      title="Mensagens"
      description="Gerencie suas conversas com clientes"
    >
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
          <Card className="col-span-1 overflow-hidden border-border">
            <div className="p-3 border-b border-border">
              <Input 
                placeholder="Buscar contatos" 
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="overflow-y-auto h-[calc(70vh-120px)]">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <div 
                    key={contact.id}
                    className={`flex items-start gap-3 p-3 hover:bg-accent cursor-pointer transition-colors border-b border-border ${selectedContact?.id === contact.id ? 'bg-accent' : ''}`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar_url} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{contact.name}</p>
                        {contact.unread_count > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">{contact.unread_count}</span>
                        )}
                      </div>
                      {contact.last_message && (
                        <p className="text-muted-foreground text-sm truncate">{contact.last_message}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum contato encontrado
                </div>
              )}
            </div>
          </Card>

          <Card className="col-span-1 md:col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedContact.avatar_url} alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedContact.name}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(70vh-180px)]">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender_id === user?.id 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-accent text-accent-foreground rounded-tl-none'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-border">
                  <form 
                    className="flex items-center gap-2" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <Input 
                      placeholder="Escreva uma mensagem..." 
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Enviar</span>
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Selecione um contato para iniciar uma conversa
              </div>
            )}
          </Card>
        </div>
      )}
    </HostLayout>
  );
};

export default Messages;
