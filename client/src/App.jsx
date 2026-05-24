import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import RSVPPage from './pages/RSVPPage';
import CeremonyPage from './pages/CeremonyPage';
import GalleryPage from './pages/GalleryPage';
import GuestPhotoPage from './pages/GuestPhotoPage';
import './index.css';

function AppContent() {
  const { currentTheme } = useTheme();

  return (
    <div style={{ backgroundColor: currentTheme.bgColor, color: currentTheme.textColor }}>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/guest-photos" element={<GuestPhotoPage />} />
        <Route path="/ceremony" element={<CeremonyPage />} />
        <Route path="/rsvp" element={<RSVPPage />} />
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
