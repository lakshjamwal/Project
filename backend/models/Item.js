import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  location: String,
  date: Date,
  photoUrl: String,
  status: { type: String, enum: ['active', 'claimed', 'returned'], default: 'active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimQuestion: String,
  tags: [{ type: String }],
  approved: { type: Boolean, default: true }
}, { timestamps: true });

itemSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Item', itemSchema);
