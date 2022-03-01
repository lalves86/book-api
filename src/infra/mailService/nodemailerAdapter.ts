import nodemailer from 'nodemailer'
import { Mail, MailService } from '@/data/ports/mail/mailService'

export class NodemailerAdapter implements MailService {
  async send (mailInfo: Mail): Promise<Mail> {
    try {
      const { host, port, username, password, from, to, subject, text, html } = mailInfo
      const transporter = nodemailer.createTransport({
        host,
        port,
        auth: {
          user: username,
          pass: password
        }
      })

      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
      })
      return mailInfo
    } catch (error) {
      console.error(error)
    }
  }
}
