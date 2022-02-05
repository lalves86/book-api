import { Book } from '../../domain/book'

export interface BookRepository {
  create (book: Book): Promise<Book>
  list (): Promise<Book[]>
  getByTitle (title: string): Promise<Book>
}
