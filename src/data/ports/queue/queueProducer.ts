import { Mail } from '../mail/mailService'

export interface QueueProducer {
  addToQueue (input: Mail): Promise<Mail>
}
