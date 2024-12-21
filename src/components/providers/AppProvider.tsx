import { ReactNode, useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import { useSettings } from '@/hooks/useSettings';
import { requestNotificationPermission } from '@/lib/notifications';
import { useAuth } from '@/lib/auth';
import { socketService } from '@/lib/socket';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  useTheme();
  const { notifications } = useSettings();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (notifications) {
      requestNotificationPermission();
    }
  }, [notifications]);

  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect(user.id);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  return <>{children}</>;
}