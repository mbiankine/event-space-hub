
import React, { useState } from 'react';
import { HostLayout } from '@/components/layouts/HostLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Search, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(0);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  // Mock data for conversations
  const conversations = [
    {
      id: 0,
      name: 'João Silva',
      lastMessage: 'Olá, gostaria de fazer uma reserva para o próximo sábado.',
      time: '10:45',
      avatar: '',
      unread: 2,
      messages: [
        { id: 1, sender: 'client', text: 'Olá, gostaria de fazer uma reserva para o próximo sábado.', time: '10:30' },
        { id: 2, sender: 'client', text: 'Para cerca de 25 pessoas, é possível?', time: '10:32' },
        { id: 3, sender: 'host', text: 'Olá João! Sim, temos disponibilidade para sábado.', time: '10:45' },
      ]
    },
    {
      id: 1,
      name: 'Maria Oliveira',
      lastMessage: 'O espaço tem estacionamento?',
      time: '09:20',
      avatar: '',
      unread: 0,
      messages: [
        { id: 1, sender: 'client', text: 'Bom dia, o espaço tem estacionamento?', time: '09:15' },
        { id: 2, sender: 'host', text: 'Bom dia Maria! Sim, temos estacionamento para até 15 carros.', time: '09:20' },
      ]
    },
    {
      id: 2,
      name: 'Pedro Santos',
      lastMessage: 'Muito obrigado pela atenção!',
      time: 'Ontem',
      avatar: '',
      unread: 0,
      messages: [
        { id: 1, sender: 'client', text: 'Olá, gostaria de saber o valor para o aluguel do espaço.', time: '14:30' },
        { id: 2, sender: 'host', text: 'Olá Pedro! O valor para o aluguel é R$ 2.500 por dia.', time: '15:00' },
        { id: 3, sender: 'client', text: 'E para meio período?', time: '15:05' },
        { id: 4, sender: 'host', text: 'Para meio período o valor é R$ 1.500.', time: '15:10' },
        { id: 5, sender: 'client', text: 'Muito obrigado pela atenção!', time: '15:15' },
      ]
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <HostLayout
      title="Mensagens"
      description="Gerencie suas conversas com clientes"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        {/* Conversations List */}
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold flex justify-between items-center">
              Conversas
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-accent/50 ${
                  selectedConversation === conversation.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{conversation.name}</p>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {conversation.unread}
                  </span>
                )}
              </div>
            ))}
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          {selectedConversation !== null ? (
            <>
              <CardHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversations[selectedConversation].avatar} alt={conversations[selectedConversation].name} />
                    <AvatarFallback>{getInitials(conversations[selectedConversation].name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{conversations[selectedConversation].name}</CardTitle>
                    <p className="text-xs text-muted-foreground">Cliente</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-4 min-h-[300px]">
                  {conversations[selectedConversation].messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'host' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'host'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'host' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Selecione uma conversa para começar</p>
            </div>
          )}
        </Card>
      </div>
    </HostLayout>
  );
};

export default Messages;
