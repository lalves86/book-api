import { ListBooksByUser } from '@/data/usecases/books/listBooksByUser'
import Mockdate from 'mockdate'
import { BookRepositoryStub } from '@test/stubs'

type sutTypes = {
  sut: ListBooksByUser
  bookRepositoryStub: BookRepositoryStub
}

const makeSut = (): sutTypes => {
  const bookRepositoryStub = new BookRepositoryStub()
  const sut = new ListBooksByUser(bookRepositoryStub)
  return {
    sut,
    bookRepositoryStub
  }
}

describe('List books by userId', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call execute with correct params', async () => {
    const { sut } = makeSut()

    const result = await sut.execute('fake_user_id')

    expect(result[0].title).toEqual('Fake Title 1')
    expect(result[1].title).toEqual('Fake Title 2')
    expect(result[2].title).toEqual('Fake Title 3')
  })
})
