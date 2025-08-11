import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error('MONGO_URI missing in .env');

mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));

await mongoose.connect(uri, { dbName: process.env.MONGO_DB || 'campuscrate' });
