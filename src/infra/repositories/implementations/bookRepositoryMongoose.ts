import { Book } from '@/domain/book'
import { CreateBookDto, UpdateBookDto } from '@/usecases/dtos/books'
import { BookRepository } from '@/usecases/ports/repositories/bookRepository'
import { bookModel } from '@/infra/databases/mongodb/model/bookModel'

export class BookRepositoryMongoose implements BookRepository {
  async create (book: CreateBookDto): Promise<Book> {
    console.log(book)
    const newBook = await bookModel.create(book)
    return newBook
  }

  async list (): Promise<Book[]> {
    const books = await bookModel.find()
    return books
  }

  async listById (id: string): Promise<Book> {
    const book = await bookModel.findById(id)
    return book
  }

  async getByTitle (title: string): Promise<Book> {
    const book = await bookModel.findOne({ title })
    return book
  }

  async update (book: UpdateBookDto): Promise<Book> {
    const updatedBook = await bookModel.findOneAndUpdate({ _id: book.id }, book, {
      new: true
    })
    return updatedBook
  }

  async delete (id: string): Promise<string> {
    await bookModel.findByIdAndDelete(id)
    return `Book with id ${id} deleted`
  }
}
