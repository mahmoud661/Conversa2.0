import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

export function Notification({ message, type = 'success', duration = 3000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-lg',
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      )}
    >
      <span>{message}</span>
      <button onClick={() => setIsVisible(false)} className="rounded-full p-1 hover:bg-white/20">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}