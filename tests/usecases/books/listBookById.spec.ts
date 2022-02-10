import Mockdate from 'mockdate'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { ListBookById } from '@/usecases/books/listBookById'

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
    const listBooksUsecase = makeSut()

    const result = await listBooksUsecase.execute('fake_id')

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
})
