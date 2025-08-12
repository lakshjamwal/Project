import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Item from '../models/Item.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  const { type, q, category, status, page = 1, limit = 20 } = req.query;
  const filter = { approved: true };
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Item.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('postedBy', 'name email'),
    Item.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

router.post('/', authRequired, upload.single('photo'), async (req, res) => {
  try {
    const { type, title, description, category, location, date, claimQuestion, tags } = req.body;
    let photoUrl = '';
    if (req.file && process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'campuscrate' }, (err, uploaded) => {
          if (err) reject(err); else resolve(uploaded);
        });
        stream.end(req.file.buffer);
      });
      photoUrl = result.secure_url;
    }

    const item = await Item.create({
      type, title, description, category, location,
      date: date ? new Date(date) : undefined,
      photoUrl,
      postedBy: req.user._id,
      claimQuestion,
      tags: (tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map(s => s.trim())) : [])
    });
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ message: 'Create failed' });
  }
});

router.patch('/:id/status', authRequired, async (req, res) => {
  const { status } = req.body; // 'claimed' | 'returned' | 'active'
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  const isOwner = item.postedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  item.status = status || item.status;
  await item.save();
  res.json(item);
});

export default router;
