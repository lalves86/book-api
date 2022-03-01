export class UserAlreadyExistsError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'UserAlreadyExistsError'
  }
}
