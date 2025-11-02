import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../Storage';
import { useAuth } from './AuthContext';
import { useMonetization } from './MonetizationContext'; // ADD THIS IMPORT

export type Theme = 'default' | 'dark' | 'blue' | 'green' | 'purple';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
  resetTheme: () => void; // ADD THIS FUNCTION
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isPro } = useMonetization(); // ADD THIS
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');

  useEffect(() => {
  // Auto-reset theme when user becomes null (logout)
  if (!user) {
    setCurrentTheme('default');
    applyThemeToDocument('default');
  }
}, [user]);
  useEffect(() => {
    if (user && isPro) {
      // Only load saved theme for Pro users
      storage.get(`theme_${user.uid}`).then((savedTheme) => {
        if (savedTheme) {
          setCurrentTheme(savedTheme);
          applyThemeToDocument(savedTheme);
        }
      });
    } else {
      // For non-Pro users or when no user, force default theme
      setCurrentTheme('default');
      applyThemeToDocument('default');
    }
  }, [user, isPro]); // ADD isPro TO DEPENDENCIES

  const applyThemeToDocument = (theme: Theme) => {
    // Remove all existing theme classes
    document.body.classList.remove('theme-default', 'theme-dark', 'theme-blue', 'theme-green', 'theme-purple');
    // Add the current theme class
    document.body.classList.add(`theme-${theme}`);
  };

  // ADD RESET THEME FUNCTION
  const resetTheme = () => {
    setCurrentTheme('default');
    applyThemeToDocument('default');
    
    if (user) {
      storage.remove(`theme_${user.uid}`);
    }
  };

  const setTheme = (theme: Theme) => {
    // Only allow theme changes for Pro users
    if (!isPro) {
      console.log('Theme customization is a Pro feature');
      return;
    }
    
    setCurrentTheme(theme);
    applyThemeToDocument(theme);
    
    if (user) {
      storage.set(`theme_${user.uid}`, theme);
    }
  };

  const availableThemes: Theme[] = ['default', 'dark', 'blue', 'green', 'purple'];

  const value = {
    currentTheme,
    setTheme,
    availableThemes,
    resetTheme // ADD TO CONTEXT VALUE
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};