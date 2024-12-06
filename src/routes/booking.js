const express = require('express');
const prisma = require('../config/prisma');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get Train Availability
router.get('/availability', async (req, res) => {
  const { source, destination } = req.query;

  const trains = await prisma.train.findMany({
    where: { source, destination },
  });

  res.json(trains);
});

// Book a Seat
router.post('/book', verifyToken, async (req, res) => {
  const { trainId, seats } = req.body;

  const train = await prisma.train.findUnique({ where: { id: trainId } });

  if (!train || train.seats < seats) {
    return res.status(400).json({ message: 'Not enough seats available' });
  }

  await prisma.$transaction([
    prisma.train.update({
      where: { id: trainId },
      data: { seats: train.seats - seats },
    }),
    prisma.booking.create({
      data: { userId: req.user.id, trainId, seats },
    }),
  ]);

  res.status(201).json({ message: 'Booking successful' });
});

// Get Booking Details
router.get('/booking', verifyToken, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: { train: true },
  });

  res.json(bookings);
});

module.exports = router;
