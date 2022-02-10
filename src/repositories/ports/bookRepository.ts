import { Book } from '../../domain/book'

export interface BookRepository {
  create (book: Book): Promise<Book>
  list (): Promise<Book[]>
  listById (id: string): Promise<Book>
  getByTitle (title: string): Promise<Book>
}
