const express = require('express');
const prisma = require('../config/prisma');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get Train Availability
router.get('/availability', async (req, res) => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({ message: 'Source and destination are required' });
    }

    const trains = await prisma.train.findMany({
      where: { source, destination },
    });

    if (trains.length === 0) {
      return res.status(404).json({ message: 'No trains found for the given route' });
    }

    res.json(trains);
  } catch (error) {
    console.error('Error fetching train availability:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Book a Seat
router.post('/book', verifyToken, async (req, res) => {
  try {
    const { trainId, seats } = req.body;

    if (!trainId || !seats || seats <= 0) {
      return res.status(400).json({ message: 'Train ID and valid seat count are required' });
    }

    const train = await prisma.train.findUnique({ where: { id: trainId } });

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    if (train.seats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    await prisma.$transaction(async (transaction) => {
      // Lock the train row and update seat count atomically
      const updatedTrain = await transaction.train.update({
        where: { id: trainId },
        data: { seats: train.seats - seats },
      });

      // Ensure seats were successfully updated
      if (updatedTrain.seats < 0) {
        throw new Error('Race condition detected, retry booking');
      }

      // Create booking
      await transaction.booking.create({
        data: { userId: req.user.id, trainId, seats },
      });
    });

    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error booking seat:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Booking Details
router.get('/booking', verifyToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { train: true },
    });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for the user' });
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching booking details:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
