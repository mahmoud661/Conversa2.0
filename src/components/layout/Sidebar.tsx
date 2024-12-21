import { NavLink } from 'react-router-dom';
import { MessageSquare, Users, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: MessageSquare, to: '/chat', label: 'Messages' },
  { icon: Users, to: '/contacts', label: 'Contacts' },
  { icon: User, to: '/profile', label: 'Profile' },
  { icon: Settings, to: '/settings', label: 'Settings' },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-16 flex-col border-r bg-card px-2 py-4">
      <div className="flex flex-col items-center gap-4">
        {navItems.map(({ icon: Icon, to, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                size="icon"
                className={cn(
                  'h-12 w-12 rounded-xl transition-all hover:bg-accent',
                  isActive && 'bg-accent shadow-lg'
                )}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </Button>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}