import { useState } from 'react';
import { Send, Mic, PaperclipIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim()) {
      console.log('ChatInput: Send button pressed with message:', message.trim());
      onSendMessage(message.trim());
      setMessage('');
      console.log('ChatInput: Message input cleared after sending');
    }
  };

  return (
    <div className="flex w-full gap-2 p-4">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        aria-label="Attach file"
      >
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="min-h-[44px] resize-none"
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
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button 
          onClick={() => {
            console.log('ChatInput: Send button clicked');
            handleSend();
          }}
          aria-label="Send message"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}