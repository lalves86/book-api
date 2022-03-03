import amqp from 'amqplib'

export const rabbitMqConfig = async () => {
  try {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`)
    return connection
  } catch (error) {
    console.error('Error connecting RabbitMQ')
    console.error(error)
  }
}
