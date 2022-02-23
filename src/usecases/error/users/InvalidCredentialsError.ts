export class InvalidCredentialsError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'InvalidCredentialsError'
  }
}
