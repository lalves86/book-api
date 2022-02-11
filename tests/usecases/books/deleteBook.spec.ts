import Mockdate from 'mockdate'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { DeleteBook } from '@/usecases/books'
import { BookNotFoundError } from '@/usecases/error'

type sutTypes = {
  sut: DeleteBook
  bookRepositoryStub: BookRepositoryStub
}

const makeSut = (): sutTypes => {
  const bookRepositoryStub = new BookRepositoryStub()
  const sut = new DeleteBook(bookRepositoryStub)
  return {
    sut,
    bookRepositoryStub
  }
}

describe('DeleteBook', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call book repository with correct parameters', async () => {
    const { sut } = makeSut()

    expect(await sut.execute('fake_id')).toEqual('Book with id fake_id deleted')
  })

  it('should throw BookNotFoundError if id is not found', async () => {
    const { sut, bookRepositoryStub } = makeSut()
    jest.spyOn(bookRepositoryStub, 'listById').mockReturnValueOnce(Promise.resolve(null))

    const promise = sut.execute('wrong_id')

    await expect(promise).rejects.toThrow(BookNotFoundError)
  })
})
