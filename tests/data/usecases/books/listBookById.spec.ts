import Mockdate from 'mockdate'
import { BookRepositoryStub } from '@test/stubs'
import { ListBookById } from '@/data/usecases/books'
import { BookNotFoundError } from '@/data/error/books'

type sutTypes = {
  sut: ListBookById
  bookRepositoryStub: BookRepositoryStub
}

const makeSut = (): sutTypes => {
  const bookRepositoryStub = new BookRepositoryStub()
  const sut = new ListBookById(bookRepositoryStub)
  return {
    sut,
    bookRepositoryStub
  }
}

describe('ListBookById', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call book repository with correct parameters', async () => {
    const { sut } = makeSut()

    const result = await sut.execute('fake_id')

    expect(result).toEqual({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read',
      userId: 'fake_user_id',
      imageUrl: 'http://fake.url'
    })
  })

  it('should throw BookNotFoundError if id is not found', async () => {
    const { sut, bookRepositoryStub } = makeSut()

    jest.spyOn(bookRepositoryStub, 'listById').mockReturnValueOnce(Promise.resolve(null))

    const promise = sut.execute('wrong_id')

    await expect(promise).rejects.toThrow(BookNotFoundError)
  })
})
