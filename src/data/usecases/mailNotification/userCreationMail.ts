import { CreateUserDto } from '@/data/dtos/users'
import { MailServiceError } from '@/data/error/mail/mailServiceError'
import { MailParser } from '@/data/ports/mail/mailParser'
import { Mail, MailService } from '@/data/ports/mail/mailService'
import { UseCase } from '@/data/ports/usecase'

export class UserCreationMail implements UseCase<Mail> {
  constructor (
    private mailOptions: Mail,
    private mailService: MailService,
    private mailParser: MailParser
  ) {}

  async execute (user: CreateUserDto): Promise<Mail> {
    const mailInfo: Mail = {
      host: this.mailOptions.host,
      port: this.mailOptions.port,
      username: this.mailOptions.username,
      password: this.mailOptions.password,
      from: this.mailOptions.from,
      to: `${user.username} <${user.email}>`,
      subject: 'Sua conta no Book API foi criada!',
      html: this.mailParser.parse(user.username)
    }
    const mail = await this.mailService.send(mailInfo)
    if (!mail) {
      throw new MailServiceError('The e-mail could not be sent')
    }
    return mail
  }
}
