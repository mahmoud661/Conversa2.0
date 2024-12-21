import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex w-full gap-2',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-2',
          isCurrentUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <p className="text-sm">{message.content}</p>
        {message.translated && (
          <div className="mt-1 text-xs opacity-80">
            <p className="italic">{message.translated.text}</p>
          </div>
        )}
        <div className="flex items-center justify-end gap-1 text-xs opacity-70">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isCurrentUser && <Check className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}