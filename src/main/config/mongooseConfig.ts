import mongoose from 'mongoose'

export const mongooseConnect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/book-store')
    console.log('Database connected')
  } catch (error) {
    console.error('Error connecting database')
    console.error(error)
    process.exit(1)
  }
}
