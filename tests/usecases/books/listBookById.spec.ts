import Mockdate from 'mockdate'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { ListBookById } from '@/usecases/books/listBookById'
import { BookNotFoundError } from '@/usecases/error/bookNotFountError'

const makeSut = (): ListBookById => {
  const bookRepositoryStub = new BookRepositoryStub()
  return new ListBookById(bookRepositoryStub)
}

describe('ListBookById', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call book repository with correct parameters', async () => {
    const sut = makeSut()

    const result = await sut.execute('fake_id')

    expect(result).toEqual({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    })
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
