import { Mail } from '@/data/ports/mail/mailService'
import { QueueProducer } from '@/data/ports/queue/queueProducer'
import { rabbitMqConfig } from '@/main/config/rabbitMqConfig'

export class RabbitMqProducerAdapter implements QueueProducer {
  async addToQueue (input: Mail): Promise<Mail> {
    const connection = await rabbitMqConfig()
    const channel = await connection.createChannel()
    const queue = 'mailQueue'
    await channel.assertQueue(queue, { durable: false })
    const message = JSON.stringify(input)
    channel.sendToQueue(queue, Buffer.from(message))
    setTimeout(() => {
      connection.close()
    }, 500)
    return input
  }
}
