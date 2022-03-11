import Mockdate from 'mockdate'
import { ListBooks } from '@/data/usecases/books'
import { BookRepositoryStub } from '@test/stubs'

const makeSut = (): ListBooks => {
  const bookRepositoryStub = new BookRepositoryStub()
  return new ListBooks(bookRepositoryStub)
}

describe('ListBooks', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call book repository with correct parameters', async () => {
    const listBooksUsecase = makeSut()

    const result = await listBooksUsecase.execute()

    expect(result[0]).toEqual({
      id: 'fake_id_1',
      title: 'Fake Title 1',
      author: 'Fake Author 1',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read',
      userId: 'fake_user_id'
    })
  })
})
