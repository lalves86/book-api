import { Book } from '@/domain/book'
import { CreateBookDto, UpdateBookDto } from '@/usecases/dtos/books'

export interface BookRepository {
  create (book: CreateBookDto): Promise<Book>
  list (): Promise<Book[]>
  listById (id: string): Promise<Book>
  getByTitle (title: string): Promise<Book>
  update (book: UpdateBookDto): Promise<Book>
  delete (id: string): Promise<string>
  listByUserId (userId: string): Promise<Book[]>
}
