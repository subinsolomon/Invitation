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

  // ===== CUSTOMIZE THEMES HERE =====
  // To add new themes (e.g., 'rose', 'beige', 'navy'), add them below.
  // To change which themes are shown in the UI, modify the 'uiThemes' array at the bottom.
  // 
  // Example: Add a Rose theme
  // rose: {
  //   primaryColor: '#8b0000',
  //   secondaryColor: '#fff0f5',
  //   accentColor: '#ff1493',
  //   bgColor: '#ffe4e1',
  //   textColor: '#8b0000',
  // },
  //
  // Example: Add a Beige theme
  // beige: {
  //   primaryColor: '#f5f5dc',
  //   secondaryColor: '#2f4f4f',
  //   accentColor: '#daa520',
  //   bgColor: '#fffaf0',
  //   textColor: '#2f4f4f',
  // },
  // ================================

  const allThemes = {
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
    // Add custom themes here:
    // rose: { ... },
    // beige: { ... },
  };

  // ===== SELECT WHICH THEMES TO SHOW IN UI =====
  // Only the themes listed here will appear in the Navigation theme switcher
  const uiThemes = ['dark', 'light'];
  // Examples:
  // const uiThemes = ['dark', 'rose'];  // Show Dark and Rose
  // const uiThemes = ['light', 'beige']; // Show Light and Beige
  // const uiThemes = ['dark', 'light', 'rose']; // Show all three
  // =============================================

  const currentTheme = allThemes[theme] || allThemes.dark;

  useEffect(() => {
    localStorage.setItem('wedding-theme', JSON.stringify(theme));
  }, [theme]);

  const switchTheme = (newTheme) => {
    if (allThemes[newTheme]) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, switchTheme, availableThemes: uiThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};
