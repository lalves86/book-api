export interface Mail {
  host: string
  port: number
  username: string
  password: string
  from: string
  to: string
  subject: string
  text?: string
  html?: string
  attachments?: Object[]
}

export interface MailService {
  send (input: Mail): Promise<Mail>
}
