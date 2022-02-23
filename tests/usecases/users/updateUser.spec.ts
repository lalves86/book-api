import { UpdateUserDto } from '@/usecases/dtos/users'
import { UserNotFoundError } from '@/usecases/error/users/userNotFoundError'
import { UpdateUser } from '@/usecases/users/updateUser'
import Mockdate from 'mockdate'
import { CryptoStub } from '../stubs/cryptoStub'
import { UserRepositoryStub } from '../stubs/userRepositoryStub'

type sutTypes = {
  sut: UpdateUser
  userRepositoryStub: UserRepositoryStub
  cryptoStub: CryptoStub
}

const makeSut = (): sutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const cryptoStub = new CryptoStub()
  const sut = new UpdateUser(userRepositoryStub, cryptoStub)
  return {
    sut,
    userRepositoryStub,
    cryptoStub
  }
}

describe('Update user', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call execute with correct params', async () => {
    const { sut } = makeSut()

    const fakeData: UpdateUserDto = {
      id: 'fake_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password'
    }

    const result = await sut.execute(fakeData)
    expect(result.id).toBe('fake_id')
    expect(result.username).toBe('fake_username')
    expect(result.email).toBe('fake@mail.com')
    expect(result.password).toBe('fake_password-hash')
  })

  it('should throw UserNotFoundError if id does not match', async () => {
    const { sut, userRepositoryStub } = makeSut()

    jest.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null))

    const fakeData: UpdateUserDto = {
      id: 'wrong_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password'
    }

    await expect(sut.execute(fakeData)).rejects.toThrow(new UserNotFoundError('User not found'))
  })
})
