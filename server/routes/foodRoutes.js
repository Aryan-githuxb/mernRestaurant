import express from 'express';
const router = express.Router();
import Food from '../models/Food.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/', async (req, res) => {
  const foods = await Food.find({});
  res.json(foods);
});

router.post('/', protect, admin, async (req, res) => {
  const { name, image, type, price } = req.body;
  const createdFood = await Food.create({ name, image, type, price });
  res.status(201).json(createdFood);
});

router.delete('/:id', protect, admin, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: 'Food removed' });
});

export default router;