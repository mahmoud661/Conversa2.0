import { useState } from 'react';
import { ContactCard } from '@/components/contacts/ContactCard';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, UserPlus } from 'lucide-react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dummy user data
const dummyUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
    status: "online"
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    status: "online"
  },
  {
    id: "user-3",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson",
    status: "away"
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis",
    status: "offline"
  }
];

// Dummy AI assistant data
const dummyAIContacts: (User & { isAI: boolean })[] = [
  {
    id: "ai-assistant",
    name: "AI Assistant",
    email: "assistant@example.com",
    avatar: "https://ui-avatars.com/api/?name=AI+Assistant&background=4F46E5&color=fff",
    status: "online",
    isAI: true
  },
  {
    id: "ai-helper",
    name: "Helper Bot",
    email: "helper@example.com",
    avatar: "https://ui-avatars.com/api/?name=Helper+Bot&background=10B981&color=fff",
    status: "online",
    isAI: true
  },
  {
    id: "ai-writer",
    name: "Content Writer",
    email: "writer@example.com",
    avatar: "https://ui-avatars.com/api/?name=Content+Writer&background=F59E0B&color=fff",
    status: "online",
    isAI: true
  }
];

export function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = dummyUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAIContacts = dummyAIContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-card p-6">
        <h1 className="mb-4 text-2xl font-bold">Contacts</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="users" className="flex-1">
        <div className="border-b px-6 pt-2">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="ai">AI Assistants</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="flex-1">
          <ScrollArea className="h-full p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="group relative">
                  <ContactCard contact={user} />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="ai" className="flex-1">
          <ScrollArea className="h-full p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAIContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}