
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export const MessageBubble = ({ content, timestamp, isCurrentUser }: MessageBubbleProps) => {
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
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}
      >
        <p className="break-words">{content}</p>
        <p className={`text-xs mt-1 ${
          isCurrentUser 
            ? 'text-primary-foreground/70' 
            : 'text-muted-foreground'
        }`}>
          {formatMessageDate(timestamp)}
        </p>
      </div>
    </div>
  );
};
