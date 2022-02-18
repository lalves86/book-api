import mongoose from 'mongoose'
import { bookSchema } from '../schemas/bookSchema'

export const bookModel = mongoose.model('Book', bookSchema)
