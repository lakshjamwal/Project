import express from 'express';
import { authRequired, adminOnly } from '../middleware/auth.js';
import Item from '../models/Item.js';
import User from '../models/User.js';

const router = express.Router();

router.use(authRequired, adminOnly);

router.get('/items', async (_req, res) => {
  const items = await Item.find().sort({ createdAt: -1 }).populate('postedBy', 'name email');
  res.json(items);
});

router.patch('/items/:id/approve', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.approved = req.body.approved === true;
  await item.save();
  res.json(item);
});

router.patch('/users/:id/block', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.blocked = req.body.blocked === true;
  await user.save();
  res.json(user);
});

export default router;
