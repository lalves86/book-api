import { Book } from '@/domain/book'
import { CreateBookDto } from '@/usecases/dtos/createBookDto'
import { UpdateBookDto } from '@/usecases/dtos/updateBookDto'

export interface BookRepository {
  create (book: CreateBookDto): Promise<Book>
  list (): Promise<Book[]>
  listById (id: string): Promise<Book>
  getByTitle (title: string): Promise<Book>
  update (book: UpdateBookDto): Promise<Book>
  delete (id: string): Promise<string>
}
