import { UserNotFoundError } from '@/usecases/error/users/userNotFoundError'
import { ListUserById } from '@/usecases/users/listUserById'
import Mockdate from 'mockdate'
import { UserRepositoryStub } from '../stubs/userRepositoryStub'

type sutTypes = {
  sut: ListUserById
  userRepositoryStub: UserRepositoryStub
}

const makeSut = (): sutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new ListUserById(userRepositoryStub)
  return {
    sut,
    userRepositoryStub
  }
}

describe('List user by id', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call execute with correct params', async () => {
    const { sut } = makeSut()

    const result = await sut.execute('fake_id')
    expect(result.username).toBe('fake_username')
    expect(result.email).toBe('fake@mail.com')
    expect(result.password).toBe('fake_password-hash')
    expect(result.createdAt).toBeDefined()
  })

  it('should throw UserNotFoundError if user id is not correct', async () => {
    const { sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null))

    await expect(sut.execute('fake_id')).rejects.toThrow(new UserNotFoundError('User not found'))
  })
})
