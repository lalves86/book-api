import amqp from 'amqplib'

export const rabbitMqConfig = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    console.log('Producer connected')
    return connection
  } catch (error) {
    console.error('Error connecting RabbitMQ')
    console.error(error)
    process.exit(1)
  }
}
