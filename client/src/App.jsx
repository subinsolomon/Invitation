import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import RSVPPage from './pages/RSVPPage';
import CeremonyPage from './pages/CeremonyPage';
import './index.css';

function AppContent() {
  const { currentTheme } = useTheme();

  return (
    <div style={{ backgroundColor: currentTheme.bgColor, color: currentTheme.textColor }}>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rsvp" element={<RSVPPage />} />
        <Route path="/ceremony" element={<CeremonyPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}
