export class MailServiceError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'MailServiceError'
  }
}
