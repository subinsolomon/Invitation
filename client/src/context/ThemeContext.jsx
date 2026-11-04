import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * "Ink & Champagne" palette.
 * Kept in sync with the CSS custom properties in index.css so React-rendered
 * inline styles and pure-CSS components agree on every colour.
 */
export const palette = {
  canvas: '#0C0A08',
  canvasSoft: '#141110',
  ink: '#F2EBE1',
  inkSoft: '#C8BCAE',
  inkMuted: '#9A8C7C',
  gold: '#E3C07A',
  goldDeep: '#C8913A',
  goldPale: '#F6EAD0',
  clay: '#D08C7C',
  line: 'rgba(242, 235, 225, 0.12)',
  lineStrong: 'rgba(242, 235, 225, 0.22)',
};

/**
 * Legacy shape consumed by the pages: primary/secondary/accent/bg/text.
 * `primaryColor` stays dark because it is used as the foreground colour on
 * filled gold buttons and as the fill for inputs.
 */
const currentTheme = {
  primaryColor: palette.canvas,
  secondaryColor: palette.ink,
  accentColor: palette.gold,
  accentDeep: palette.goldDeep,
  accentPale: palette.goldPale,
  bgColor: palette.canvas,
  textColor: palette.ink,
  mutedColor: palette.inkSoft,
  lineColor: palette.line,
  clayColor: palette.clay,
  name: 'ink-champagne',
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
    document.documentElement.dataset.theme = 'ink-champagne';
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, palette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
