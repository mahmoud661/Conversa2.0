import { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { Message, User } from "@/types";
import { useSettings } from "@/hooks/useSettings";
import { showNotification } from "@/lib/notifications";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dummy contacts data
const dummyContacts = [
  {
    id: "contact-1",
    name: "Jane Smith",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    status: "online",
    email: "jane.smith@example.com",
    isAI: false
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    avatar: "https://ui-avatars.com/api/?name=AI+Assistant&background=4F46E5&color=fff",
    status: "online",
    email: "assistant@example.com",
    isAI: true
  }
];

// Dummy user data
const dummyUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://ui-avatars.com/api/?name=John+Doe",
  status: "online"
};

// Dummy initial messages
const initialMessages: Record<string, Message[]> = {
  "contact-1": [
    {
      id: "msg-1",
      content: "Hey there! How are you doing?",
      senderId: "contact-1",
      receiverId: "user-1",
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: "msg-2",
      content: "I'm doing great! Just working on our chat app.",
      senderId: "user-1",
      receiverId: "contact-1",
      timestamp: new Date(Date.now() - 3500000) // 58 minutes ago
    },
    {
      id: "msg-3",
      content: "That sounds awesome! Can't wait to see it.",
      senderId: "contact-1",
      receiverId: "user-1",
      timestamp: new Date(Date.now() - 3400000) // 56 minutes ago
    }
  ],
  "ai-assistant": [
    {
      id: "ai-msg-1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      senderId: "ai-assistant",
      receiverId: "user-1",
      timestamp: new Date(Date.now() - 7200000) // 2 hours ago
    }
  ]
};

// Simple AI response generator
const generateAIResponse = (message: string): string => {
  const responses = [
    `I understand you're saying: "${message}". How can I assist with that?`,
    `Thanks for your message. I'd be happy to help with "${message.substring(0, 20)}..."`,
    `I've processed your request about "${message.substring(0, 15)}...". Let me know if you need more information.`,
    `I'm analyzing your message: "${message.substring(0, 25)}...". Please give me a moment.`,
    `That's interesting! Tell me more about "${message.substring(0, 10)}..."`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Simple sound play functions
const playSound = (sound: string) => {
  console.log(`Playing ${sound} sound (dummy implementation)`);
};

export function ChatPage() {
  const { soundEnabled, notifications } = useSettings();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [user] = useState<User>(dummyUser);
  
  // Add message to chat history
  const addMessage = (contactId: string, message: Message) => {
    setChatHistory(prev => [...prev, message]);
  };

  // Check local storage for a selected contact (from ContactsPage) on component mount
  useEffect(() => {
    const storedContactJSON = localStorage.getItem('selectedContact');
    if (storedContactJSON) {
      try {
        const storedContact = JSON.parse(storedContactJSON);
        if (storedContact && storedContact.id) {
          console.log("Found stored contact:", storedContact.name);
          setSelectedContact(storedContact);
          return;
        }
      } catch (err) {
        console.error("Error parsing stored contact:", err);
      }
    }
    
    // Only set default contact if no user selection was made
    if (!selectedContact && !localStorage.getItem('userTriedSelection')) {
      console.log("Initial load with no selected contact, setting default contact");
      setSelectedContact(dummyContacts[1]); // AI Assistant by default
    }
    
    // Mark that user has attempted to select a contact
    if (selectedContact && selectedContact.id) {
      localStorage.setItem('userTriedSelection', 'true');
    }
  }, [selectedContact]);

  // Debug logging for user and selected contact
  useEffect(() => {
    console.log("Current auth status:", {
      isAuthenticated: !!user,
      userId: user?.id,
      userName: user?.name,
      selectedContactId: selectedContact?.id,
      selectedContactName: selectedContact?.name,
    });
  }, [user, selectedContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Load messages when contact changes
  useEffect(() => {
    if (selectedContact?.id) {
      setLoading(true);
      console.log(`Loading messages for contact ${selectedContact.id}`);
      
      // Simulate API fetch delay
      setTimeout(() => {
        const messages = initialMessages[selectedContact.id] || [];
        setChatHistory(messages);
        setLoading(false);
      }, 500);
    }
  }, [selectedContact?.id]);

  const handleSendMessage = async (content: string) => {
    if (!user?.id) {
      console.error("Cannot send message: User not authenticated");
      return;
    }

    if (!selectedContact?.id) {
      console.error("Cannot send message: No valid contact selected");
      return;
    }

    console.log("ChatPage: handleSendMessage called with content:", content);
    console.log("ChatPage: Current user:", user.name, "(ID:", user.id, ")");
    console.log(
      "ChatPage: Selected contact:",
      selectedContact.name,
      "(ID:",
      selectedContact.id,
      ")"
    );

    const message: Message = {
      id: Date.now().toString(),
      content,
      senderId: user.id,
      receiverId: selectedContact.id,
      timestamp: new Date(),
    };

    console.log("ChatPage: Message object created:", message);

    // Add to local state immediately for UI responsiveness
    addMessage(selectedContact.id, message);
    console.log("ChatPage: Message added to local store");

    if (soundEnabled) {
      playSound("message");
      console.log("ChatPage: Message sound played");
    }

    // Check if the selected contact is an AI assistant
    if (selectedContact.isAI) {
      console.log("ChatPage: Handling AI assistant message locally");

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
          playSound("notification");
        }

        if (notifications) {
          showNotification("New Message", {
            body: aiResponse.content,
            icon: selectedContact.avatar,
          });
        }
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }
  };

  if (!selectedContact) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          Select a contact to start chatting
        </p>
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
