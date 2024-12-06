const express = require('express');
const prisma = require('../config/prisma');
const { verifyAdminKey } = require('../middleware/auth');
const router = express.Router();

// Add Train
router.post('/train', verifyAdminKey, async (req, res) => {
  const { name, source, destination, seats } = req.body;

  try {
    const train = await prisma.train.create({
      data: { name, source, destination, seats },
    });

    res.status(201).json(train);
  } catch (error) {
    res.status(500).json({ message: 'Error adding train' });
  }
});

module.exports = router;
