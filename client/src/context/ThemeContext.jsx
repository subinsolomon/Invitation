import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

const currentTheme = {
  primaryColor: '#0b1724',
  secondaryColor: '#ffffff',
  accentColor: '#79bce3',
  bgColor: '#101c2a',
  textColor: '#e8f1f8',
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
