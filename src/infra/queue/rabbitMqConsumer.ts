import { makeMailService } from '@/main/factories/makeMailService'
import { rabbitMqConfig } from '@/main/config/rabbitMqConfig'

export const rabbitMqConsumer = async () => {
  const mailService = makeMailService()
  const connection = await rabbitMqConfig()
  console.log('Consumer connected')
  const channel = await connection.createChannel()
  const queue = 'mail-queue'
  await channel.assertQueue(queue, { durable: true })
  channel.consume(queue, msg => {
    const content = JSON.parse(msg.content.toString())
    mailService.send(content)
  }, {
    noAck: false
  })
}
