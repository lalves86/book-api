import { MailService } from '@/data/ports/mail/mailService'
import { NodemailerAdapter } from '@/infra/mailService/nodemailerAdapter'

export const makeMailService = (): MailService => {
  const mailService = new NodemailerAdapter()
  return mailService
}
