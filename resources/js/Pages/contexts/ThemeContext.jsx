// In your ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('theme1');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'theme1';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    // Remove all theme classes
    root.classList.remove('theme1', 'theme2', 'theme3');
    // Add the current theme class
    root.classList.add(themeName);
    localStorage.setItem('app-theme', themeName);
  };

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      switchTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};