import mongoose from 'mongoose'

export const mongooseConnect = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.HOST}:${process.env.PORT}/${process.env.DB_NAME}`)
    console.log('Database connected')
  } catch (error) {
    console.error('Error connecting database')
    console.error(error)
    process.exit(1)
  }
}
