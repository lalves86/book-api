import { Mail } from '@/data/ports/mail/mailService'

export function nodemailerConfig (): Mail {
  return {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: 'Book API <book@api.com>',
    to: '',
    subject: '',
    html: ''
  }
}
