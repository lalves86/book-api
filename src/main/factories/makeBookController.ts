import { CreateBook, DeleteBook, ListBookById, ListBooks, UpdateBook } from '@/usecases/books'
import { BookRepositoryStub } from '@test/usecases/stubs/bookRepositoryStub'
import { BookController } from '@/controllers/bookController'

export const makeBookController = (): BookController => {
  const bookRepository: BookRepositoryStub = new BookRepositoryStub()
  const createBook = new CreateBook(bookRepository)
  const listBooks = new ListBooks(bookRepository)
  const listBookById = new ListBookById(bookRepository)
  const updateBook = new UpdateBook(bookRepository)
  const deleteBook = new DeleteBook(bookRepository)

  return new BookController(
    createBook,
    listBooks,
    listBookById,
    updateBook,
    deleteBook
  )
}
