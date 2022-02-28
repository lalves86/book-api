import mongoose from 'mongoose'
import { userSchema } from '../schemas/userSchema'

export const userModel = mongoose.model('User', userSchema)
