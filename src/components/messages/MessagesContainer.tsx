
import { Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { Message } from "@/types/MessageTypes";

interface MessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentUserId: string;
}

export const MessagesContainer = ({
  messages,
  isLoading,
  error,
  currentUserId
}: MessagesContainerProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-destructive">{error}</div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Nenhuma mensagem encontrada. Inicie uma conversa!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          content={message.content}
          timestamp={message.created_at}
          isCurrentUser={message.sender_id === currentUserId}
        />
      ))}
    </div>
  );
};
