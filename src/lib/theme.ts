import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export function useTheme() {
  const { theme } = useSettings();

  useEffect(() => {
    const root = window.document.documentElement;
    
    const setTheme = (newTheme: string) => {
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      root.style.colorScheme = newTheme;
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      handleChange(mediaQuery);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setTheme(theme);
    }
  }, [theme]);
}