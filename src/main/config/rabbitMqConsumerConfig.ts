import amqp from 'amqplib'
import { makeMailService } from '../factories/makeMailService'

export const rabbitMqConsumerConfig = async () => {
  const mailService = makeMailService()

  try {
    const connection = await amqp.connect('amqp://localhost')
    console.log('Consumer connected')
    const channel = await connection.createChannel()
    const queue = 'mailQueue'
    await channel.assertQueue(queue, { durable: false })
    channel.consume(queue, msg => {
      const content = JSON.parse(msg.content.toString())
      mailService.send(content)
    }, {
      noAck: true
    })
  } catch (error) {
    console.error('Error connecting RabbitMQ')
    console.error(error)
    process.exit(1)
  }
}
