import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
