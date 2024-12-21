import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAI: {
    type: Boolean,
    default: false
  },
  translated: {
    text: String,
    language: String
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Message = mongoose.model('Message', messageSchema);