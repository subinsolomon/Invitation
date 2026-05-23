import prisma from '../config/database.js';

export const createRSVP = async (req, res) => {
  try {
    const { name, email, phone, attendance } = req.body;

    // Check if email already exists
    const existingRSVP = await prisma.rSVP.findUnique({
      where: { email },
    });

    if (existingRSVP) {
      return res.status(400).json({ 
        message: 'Email already registered. Please use a different email.' 
      });
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        name,
        email,
        phone: phone || null,
        attendance,
      },
    });

    res.status(201).json({ 
      message: 'RSVP submitted successfully!', 
      data: rsvp 
    });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllRSVPs = async (req, res) => {
  try {
    const rsvps = await prisma.rSVP.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const summary = {
      total: rsvps.length,
      attending: rsvps.filter(r => r.attendance).length,
      notAttending: rsvps.filter(r => !r.attendance).length,
      rsvps,
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRSVPCount = async (req, res) => {
  try {
    const total = await prisma.rSVP.count();
    const attending = await prisma.rSVP.count({
      where: { attendance: true },
    });
    const notAttending = await prisma.rSVP.count({
      where: { attendance: false },
    });

    res.json({ total, attending, notAttending });
  } catch (error) {
    console.error('Error fetching RSVP count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
