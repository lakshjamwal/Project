import express from 'express';
import Report from '../models/Report.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  const { itemId, reason } = req.body;
  if (!reason) return res.status(400).json({ message: 'Reason required' });
  const report = await Report.create({ itemId, reason, reporterId: req.user._id });
  res.status(201).json(report);
});

export default router;
