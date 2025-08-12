import express from 'express';
import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  const { itemId, message, answer } = req.body;
  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.postedBy.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot claim your own post' });
  }
  const claim = await Claim.create({ itemId, claimantId: req.user._id, message, answer });
  res.status(201).json(claim);
});

router.get('/mine/pending', authRequired, async (req, res) => {
  const myItemIds = await Item.find({ postedBy: req.user._id }).distinct('_id');
  const claims = await Claim.find({ itemId: { $in: myItemIds }, status: 'pending' }).populate('itemId').populate('claimantId', 'name email');
  res.json(claims);
});

router.patch('/:id', authRequired, async (req, res) => {
  const { status } = req.body; // 'approved' | 'rejected'
  const claim = await Claim.findById(req.params.id).populate('itemId');
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  const isOwner = claim.itemId.postedBy.toString() === req.user._id.toString();
  if (!isOwner) return res.status(403).json({ message: 'Forbidden' });
  claim.status = status;
  await claim.save();
  if (status === 'approved') {
    claim.itemId.status = 'claimed';
    await claim.itemId.save();
  }
  res.json(claim);
});

router.get('/my', authRequired, async (req, res) => {
  const claims = await Claim.find({ claimantId: req.user._id }).populate('itemId');
  res.json(claims);
});

export default router;
