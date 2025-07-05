import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  _id: string;
  userId: string;
  latitude: number;
  longitude: number;
  address?: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['SENT', 'DELIVERED', 'FAILED'],
    default: 'SENT',
  },
}, {
  timestamps: true,
});

// Index for faster queries
AlertSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);