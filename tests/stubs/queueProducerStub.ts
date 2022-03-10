import { Mail } from '@/data/ports/mail/mailService'
import { QueueProducer } from '@/data/ports/queue/queueProducer'

export class QueueProducerStub implements QueueProducer {
  public addToQueue (input: Mail): Promise<Mail> {
    return Promise.resolve(input)
  }
}
