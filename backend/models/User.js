import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // ✅ Added
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  blocked: { type: Boolean, default: false },
  avatar: String
}, { timestamps: true });


export default mongoose.model('User', userSchema);
