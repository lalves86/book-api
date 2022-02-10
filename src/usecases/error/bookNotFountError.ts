export class BookNotFoundError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'BookNotFoundError'
  }
}
