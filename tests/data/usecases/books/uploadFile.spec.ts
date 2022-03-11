import { UploadImageDto } from '@/data/dtos/books'
import { BookNotFoundError } from '@/data/error/books'
import { UploadFile } from '@/data/usecases/books/uploadFile'
import Mockdate from 'mockdate'
import { BookRepositoryStub } from '@test/stubs'

type sutTypes = {
  sut: UploadFile
  bookRepositoryStub: BookRepositoryStub
}

const makeSut = (): sutTypes => {
  const bookRepositoryStub = new BookRepositoryStub()
  const sut = new UploadFile(bookRepositoryStub)
  return {
    sut,
    bookRepositoryStub
  }
}

describe('Upload file', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should save an image url to the book', async () => {
    const { sut } = makeSut()

    const fakeUrl: UploadImageDto = {
      id: 'fake_id',
      imageUrl: 'http://fake.url'
    }

    const result = await sut.execute(fakeUrl)
    expect(result.imageUrl).toEqual(fakeUrl.imageUrl)
  })

  it('should throw BookNotFoundError if book id is wrong', () => {
    const { sut, bookRepositoryStub } = makeSut()
    jest.spyOn(bookRepositoryStub, 'listById').mockReturnValueOnce(Promise.resolve(null))

    const promise = sut.execute({
      id: 'fake_id',
      imageUrl: 'http://fake.url'
    })

    expect(promise).rejects.toThrow(BookNotFoundError)
  })
})
