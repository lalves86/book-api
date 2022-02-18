import mongoose from 'mongoose'

export const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  finishedAt: {
    type: Date
  },
  grade: {
    type: Number,
    min: 0,
    max: 5
  },
  status: {
    type: String,
    enum: ['Wanna read', 'Reading', 'Read'],
    default: 'Wanna read'
  }
})
