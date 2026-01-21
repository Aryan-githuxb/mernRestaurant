import express from 'express';
const router = express.Router();
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/', protect, async (req, res) => {
  const { items, totalAmount, address, phone, userName } = req.body;
  const createdOrder = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
    address,
    phone,
    userName
  });
  res.status(201).json(createdOrder);
});

router.get('/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/admin/all', protect, admin, async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

router.put('/:id/status', protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

export default router;