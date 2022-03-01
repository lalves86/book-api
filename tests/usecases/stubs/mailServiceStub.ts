import { Mail } from '@/data/ports/mail/mailService'

export const mailStub: Mail = {
  host: 'test',
  port: 1,
  username: 'test',
  password: 'test',
  from: 'From <from@mail.com>',
  to: 'To <to@mail.com>',
  subject: 'Test Subject',
  text: 'Test Text',
  html: '<p>Test Html</p>'
}

export class MailServiceStub {
  async send (input: Mail): Promise<Mail> {
    return Promise.resolve(mailStub)
  }
}
