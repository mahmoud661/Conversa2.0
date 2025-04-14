import { ReactNode, useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useSettings } from '@/hooks/useSettings';
import { requestNotificationPermission } from '@/lib/notifications';
import { useAuth } from '@/lib/auth';
import { socketService } from '@/lib/socket';
import { authApi } from '@/api/authApi';
import { useTokenStore } from '@/lib/tokenStore';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  useTheme();
  const { notifications } = useSettings();
  const { user, isAuthenticated, setUser } = useAuth();
  const token = useTokenStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  
  // Enhanced user profile loading with better error handling and retries
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Only attempt to load profile if we have a token but no user
        if (token && !user) {
          console.log("Token found, attempting to load user profile...");
          
          try {
            const userData = await authApi.getProfile();
            console.log("Profile loaded successfully:", userData);
            
            if (!userData || !userData.id) {
              console.error("Invalid user data received from API");
              useTokenStore.getState().clearToken();
            } else {
              // Ensure we have the required user fields
              setUser({
                id: userData.id,
                name: userData.name || 'User',
                email: userData.email || '',
                avatar: userData.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.name || 'User')
              });
              console.log("User state updated with profile data");
            }
          } catch (error) {
            console.error("Failed to load user profile:", error);
            // If profile loading fails, clear token to force re-login
            useTokenStore.getState().clearToken();
          }
        } else if (!token) {
          console.log("No authentication token found");
          setUser(null); // Ensure user is null when no token exists
        } else {
          console.log("User already loaded:", user?.id);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [token, user, setUser]);

  // Debug effect to monitor auth state changes
  useEffect(() => {
    console.log("Auth state changed:", { 
      hasToken: !!token,
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      userName: user?.name
    });
  }, [token, isAuthenticated, user]);

  useEffect(() => {
    if (notifications) {
      requestNotificationPermission();
    }
  }, [notifications]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Connecting socket with user:", user.id);
      socketService.connect(user.id);
      
      // Send authentication after connection
      socketService.authenticate(user.id);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  // Show loading state or render children
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}