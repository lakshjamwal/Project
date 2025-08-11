import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authRequired = async (req, res, next) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.id).lean();
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.blocked) return res.status(403).json({ message: 'User blocked' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};
