import { CreateBook, DeleteBook, ListBookById, ListBooks, UpdateBook, ListBooksByUser } from '@/usecases/books'
import { BookController } from '@/controllers/bookController'
import { BookRepositoryMongoose } from '@/infra/repositories/implementations/bookRepositoryMongoose'
import { BookRepository } from '@/usecases/ports/repositories'

export const makeBookController = (): BookController => {
  const bookRepository: BookRepository = new BookRepositoryMongoose()
  const createBook = new CreateBook(bookRepository)
  const listBooks = new ListBooks(bookRepository)
  const listBookById = new ListBookById(bookRepository)
  const updateBook = new UpdateBook(bookRepository)
  const deleteBook = new DeleteBook(bookRepository)
  const listBooksByUser = new ListBooksByUser(bookRepository)

  return new BookController(
    createBook,
    listBooks,
    listBookById,
    updateBook,
    deleteBook,
    listBooksByUser
  )
}
