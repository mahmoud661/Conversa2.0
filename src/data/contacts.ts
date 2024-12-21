import { User } from '@/types';

export const aiAssistant: User = {
  id: '2',
  name: 'AI Assistant',
  email: 'ai@example.com',
  avatar: 'https://images.unsplash.com/photo-1675426513962-63c6022a8626?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  status: 'online',
  bio: 'Your personal AI assistant, always here to help',
};

export const contacts: User[] = [
  aiAssistant,
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    status: 'online',
    bio: 'Product Designer',
  },
  {
    id: '4',
    name: 'James Miller',
    email: 'james@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    status: 'offline',
    bio: 'Software Engineer',
  },
  {
    id: '5',
    name: 'Sophia Chen',
    email: 'sophia@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    status: 'online',
    bio: 'UX Researcher',
  },
];