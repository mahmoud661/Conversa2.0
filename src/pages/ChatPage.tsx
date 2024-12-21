import { useState, useRef, useEffect } from 'react';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Message } from '@/types';
import { useSettings } from '@/hooks/useSettings';
import { sounds } from '@/lib/sound';
import { showNotification } from '@/lib/notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { chatApi } from '@/lib/api';
import { socketService } from '@/lib/socket';

export function ChatPage() {
  const { user } = useAuth();
  const { soundEnabled, notifications } = useSettings();
  const selectedContact = useChatStore((state) => state.selectedContact);
  const chatHistory = useChatStore((state) => 
    state.chatHistory[selectedContact?.id || ''] || []
  );
  const addMessage = useChatStore((state) => state.addMessage);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (selectedContact && user) {
      setLoading(true);
      chatApi.getMessages(selectedContact.id)
        .then((messages) => {
          messages.forEach((message: Message) => {
            addMessage(selectedContact.id, message);
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedContact, user, addMessage]);

  useEffect(() => {
    const unsubscribe = socketService.onMessage((message) => {
      if (message.senderId === selectedContact?.id) {
        addMessage(selectedContact.id, message);
        
        if (soundEnabled) {
          sounds.playNotificationSound();
        }
        
        if (notifications) {
          showNotification('New Message', {
            body: message.content,
            icon: selectedContact.avatar,
          });
        }
      }
    });

    return () => unsubscribe();
  }, [selectedContact, addMessage, soundEnabled, notifications]);

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      content,
      senderId: user.id,
      receiverId: selectedContact.id,
      timestamp: new Date(),
    };
    
    addMessage(selectedContact.id, message);
    
    if (soundEnabled) {
      sounds.playMessageSound();
    }

    try {
      await chatApi.sendMessage({
        content,
        receiverId: selectedContact.id,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      // TODO: Show error toast
    }
  };

  if (!selectedContact) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b bg-card p-4">
        <div className="flex items-center gap-4">
          <img
            src={selectedContact.avatar}
            alt={selectedContact.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="font-semibold">{selectedContact.name}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedContact.status}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="border-t bg-card">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}