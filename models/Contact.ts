import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  relation: string;
  userId: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  relation: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for faster queries
ContactSchema.index({ userId: 1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);