import { Mail } from '@/data/ports/mail/mailService'
import { QueueProducer } from '@/data/ports/queue/queueProducer'
import { rabbitMqConfig } from '@/main/config/rabbitMqConfig'

export class RabbitMqProducer implements QueueProducer {
  async addToQueue (input: Mail): Promise<Mail> {
    const connection = await rabbitMqConfig()
    const channel = await connection.createChannel()
    const queue = 'mail-queue'
    await channel.assertQueue(queue, { durable: true })
    const message = JSON.stringify(input)
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true })
    setTimeout(() => {
      connection.close()
    }, 500)
    return input
  }
}
