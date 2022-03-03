import { rabbitMqConfig } from '@/main/config/rabbitMqConfig'

export const rabbitMqProducer = async () => {
  const connection = await rabbitMqConfig()
  return connection
}
