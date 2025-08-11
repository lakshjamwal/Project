import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const issue = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true behind HTTPS in prod
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body; // from Google Identity Services
    if (!idToken) return res.status(400).json({ message: 'idToken missing' });
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email;
    const avatar = payload.picture;

    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
    if (allowedDomain && !email.endsWith(`@${allowedDomain}`)) {
      return res.status(403).json({ message: 'Email domain not allowed' });
    }

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, avatar });
    issue(res, user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (e) {
    res.status(401).json({ message: 'Google auth failed' });
  }
});

// Dev bypass
router.post('/dev-login', async (req, res) => {
  try {
    if (process.env.DEV_BYPASS_AUTH !== 'true') return res.status(403).json({ message: 'Dev bypass disabled' });
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name: name || email.split('@')[0], email });
    issue(res, user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: 'Dev login failed' });
  }
});

router.get('/me', async (req, res) => {
  // lightweight check based on cookie
  const token = req.cookies?.token;
  if (!token) return res.json({ user: null });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.id).lean();
    if (!user) return res.json({ user: null });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch {
    res.json({ user: null });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

export default router;
