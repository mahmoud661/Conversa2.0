import { useState } from 'react';
import { Send, Mic, PaperclipIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { useChatStore } from '@/lib/store';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const selectedContact = useChatStore((state) => state.selectedContact);

  const canSendMessage = !!user && !!selectedContact;

  const handleSend = () => {
    if (message.trim() && canSendMessage) {
      console.log('ChatInput: Send button pressed with message:', message.trim());
      console.log('ChatInput: User and contact available:', { 
        user: user?.id, 
        contact: selectedContact?.id 
      });
      onSendMessage(message.trim());
      setMessage('');
      console.log('ChatInput: Message input cleared after sending');
    } else {
      console.log('ChatInput: Cannot send message', { 
        hasContent: !!message.trim(), 
        hasUser: !!user, 
        hasContact: !!selectedContact 
      });
    }
  };

  return (
    <div className="flex w-full gap-2 p-4">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        aria-label="Attach file"
        disabled={!canSendMessage}
      >
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={canSendMessage ? "Type a message..." : "Loading chat..."}
        className="min-h-[44px] resize-none"
        disabled={!canSendMessage}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log('ChatInput: Enter key pressed (non-shift)');
            handleSend();
          }
        }}
      />
      <div className="flex shrink-0 gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Voice message"
          disabled={!canSendMessage}
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button 
          onClick={() => {
            console.log('ChatInput: Send button clicked');
            handleSend();
          }}
          aria-label="Send message"
          disabled={!canSendMessage || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}