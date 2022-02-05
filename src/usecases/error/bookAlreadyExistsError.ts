export class BookAlreadyExistsError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'BookAlreadyExistsError'
  }
}
