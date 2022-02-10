import Mockdate from 'mockdate'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { DeleteBook } from '@/usecases/books'
import { BookNotFoundError } from '@/usecases/error'

const makeSut = (): DeleteBook => {
  const bookRepositoryStub = new BookRepositoryStub()
  return new DeleteBook(bookRepositoryStub)
}

describe('DeleteBook', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call book repository with correct parameters', async () => {
    const sut = makeSut()

    expect(await sut.execute('fake_id')).toEqual('Book with id fake_id deleted')
  })

  it('should throw BookNotFoundError if id is not found', async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'execute').mockReturnValueOnce(
      Promise.reject(new BookNotFoundError('Book id not found'))
    )

    const promise = sut.execute('wrong_id')

    await expect(promise).rejects.toThrow(BookNotFoundError)
  })
})
