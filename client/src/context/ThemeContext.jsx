import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('wedding-theme');
    return saved ? JSON.parse(saved) : 'dark';
  });

  const themes = {
    dark: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#ffd700',
      bgColor: '#1a1a1a',
      textColor: '#ffffff',
    },
    light: {
      primaryColor: '#ffffff',
      secondaryColor: '#000000',
      accentColor: '#ff69b4',
      bgColor: '#f5f5f5',
      textColor: '#000000',
    },
    rose: {
      primaryColor: '#8b0000',
      secondaryColor: '#fff0f5',
      accentColor: '#ff1493',
      bgColor: '#ffe4e1',
      textColor: '#8b0000',
    },
  };

  const currentTheme = themes[theme] || themes.dark;

  useEffect(() => {
    localStorage.setItem('wedding-theme', JSON.stringify(theme));
  }, [theme]);

  const switchTheme = (newTheme) => {
    if (themes[newTheme]) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, switchTheme, availableThemes: Object.keys(themes) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
