import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Message } from '@/types';
import { useSettings } from '@/hooks/useSettings';
import { sounds } from '@/lib/sound';
import { showNotification } from '@/lib/notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { chatApi } from '@/api/chatApi';
import { socketService } from '@/lib/socket';
import { Notification } from '@/components/ui/notification';

export function ChatPage() {
  const { user } = useAuth();
  const { soundEnabled, notifications } = useSettings();
  const selectedContact = useChatStore((state) => state.selectedContact);
  const setSelectedContact = useChatStore((state) => state.setSelectedContact);
  const chatHistory = useChatStore((state) => 
    selectedContact?.id ? state.chatHistory[selectedContact.id] || [] : []
  );
  const addMessage = useChatStore((state) => state.addMessage);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Ensure we have a selected contact
  useEffect(() => {
    // If no contact is selected, default to AI Assistant
    if (!selectedContact) {
      console.log('No selected contact, setting default contact');
      import('@/data/contacts').then(({ aiAssistant }) => {
        setSelectedContact(aiAssistant);
      });
    }
    // If contact exists but has no ID, try to find a matching contact from contacts.ts
    else if (selectedContact && !selectedContact.id && selectedContact.name) {
      console.log('Contact selected but missing ID, attempting to repair contact');
      import('@/data/contacts').then(({ contacts }) => {
        // Try to find a matching contact by name
        const matchingContact = contacts.find(c => 
          c.name.toLowerCase() === selectedContact.name.toLowerCase()
        );
        
        if (matchingContact && matchingContact.id) {
          console.log('Found matching contact with ID:', matchingContact.id);
          setSelectedContact(matchingContact);
        } else {
          console.log('No matching contact found, using AI Assistant instead');
          import('@/data/contacts').then(({ aiAssistant }) => {
            setSelectedContact(aiAssistant);
          });
        }
      });
    }
  }, [selectedContact, setSelectedContact]);

  // Debug logging for user and selected contact
  useEffect(() => {
    console.log('Current auth status:', { 
      isAuthenticated: !!user, 
      userId: user?.id,
      userName: user?.name,
      selectedContactId: selectedContact?.id,
      selectedContactName: selectedContact?.name
    });
  }, [user, selectedContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Separate the message fetching into its own effect that only runs when we have valid IDs
  useEffect(() => {
    if (selectedContact?.id && user?.id) {
      console.log(`Fetching messages between user ${user.id} and contact ${selectedContact.id}`);
      setLoading(true);
      
      chatApi.getMessages(selectedContact.id)
        .then((messages) => {
          if (messages && messages.length > 0) {
            console.log(`Received ${messages.length} messages for contact ${selectedContact.id}`);
            messages.forEach((message: Message) => {
              addMessage(selectedContact.id, message);
            });
          } else {
            console.log(`No messages found for contact ${selectedContact.id}`);
          }
        })
        .catch(error => {
          console.error(`Error fetching messages for contact ${selectedContact.id}:`, error);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedContact?.id, user?.id, addMessage]);

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
    if (!user?.id) {
      console.error("Cannot send message: User not authenticated");
      return;
    }

    if (!selectedContact?.id) {
      console.error("Cannot send message: No valid contact selected");
      return;
    }

    console.log('ChatPage: handleSendMessage called with content:', content);
    console.log('ChatPage: Current user:', user.name, '(ID:', user.id, ')');
    console.log('ChatPage: Selected contact:', selectedContact.name, '(ID:', selectedContact.id, ')');
    
    const message: Message = {
      id: Date.now().toString(),
      content,
      senderId: user.id,
      receiverId: selectedContact.id,
      timestamp: new Date(),
    };
    
    console.log('ChatPage: Message object created:', message);
    
    // Add to local state immediately for UI responsiveness
    addMessage(selectedContact.id, message);
    console.log('ChatPage: Message added to local store');
    
    if (soundEnabled) {
      sounds.playMessageSound();
      console.log('ChatPage: Message sound played');
    }

    // Check if the selected contact is an AI assistant
    if (selectedContact.isAI) {
      console.log('ChatPage: Handling AI assistant message locally');
      
      // Wait a realistic amount of time before sending the AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now().toString(),
          content: generateAIResponse(content),
          senderId: selectedContact.id,
          receiverId: user.id,
          timestamp: new Date(),
        };
        
        addMessage(selectedContact.id, aiResponse);
        
        if (soundEnabled) {
          sounds.playNotificationSound();
        }
        
        if (notifications) {
          showNotification('New Message', {
            body: aiResponse.content,
            icon: selectedContact.avatar,
          });
        }
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
      
      return;
    }

    try {
      console.log('ChatPage: Sending message via API...');
      // Send via HTTP API
      const savedMessage = await chatApi.sendMessage({
        content,
        receiverId: selectedContact.id,
      });
      
      console.log('ChatPage: API response received:', savedMessage);
      
      // Also send via socket for real-time communication
      console.log('ChatPage: Sending message via socket...');
      socketService.sendMessage(message);
      console.log('ChatPage: Socket message sent');
      
      console.log('ChatPage: Message sent successfully through both channels');
    } catch (error) {
      console.error('ChatPage: Failed to send message:', error);
      // TODO: Add error toast here
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