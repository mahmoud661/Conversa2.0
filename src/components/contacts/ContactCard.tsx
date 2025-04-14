import { User } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ContactCardProps {
  contact: User & { isAI?: boolean };
}

export function ContactCard({ contact }: ContactCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Store contact info in local storage to simulate selecting a contact
    localStorage.setItem('selectedContact', JSON.stringify(contact));
    localStorage.setItem('userTriedSelection', 'true');
    navigate('/chat');
  };

  return (
    <Card
      className="group cursor-pointer p-4 transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <span
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
              contact.status === 'online' ? 'bg-green-500' : 
              contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
            )}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{contact.name}</h3>
            {contact.isAI && (
              <Badge variant="secondary" className="ml-2">
                AI
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{contact.email}</p>
        </div>
      </div>
    </Card>
  );
}