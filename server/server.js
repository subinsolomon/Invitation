import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import rsvpRoutes from './routes/rsvp.js';
import configRoutes from './routes/config.js';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/config', configRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ Server running on http://localhost:${PORT}`);
  console.log(`📅 Wedding date: ${process.env.WEDDING_DATE}`);
  console.log(`📍 Location: ${process.env.WEDDING_LOCATION}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
