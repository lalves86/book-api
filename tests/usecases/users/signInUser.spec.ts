import { SignInUser } from '@/usecases/users/signInUser'
import { CryptoStub } from '../stubs/cryptoStub'
import { UserRepositoryStub } from '../stubs/userRepositoryStub'

type sutTypes = {
  sut: SignInUser
  userRepositoryStub: UserRepositoryStub
  cryptoStub: CryptoStub
}

const makeSut = (): sutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const cryptoStub = new CryptoStub()
  const sut = new SignInUser(userRepositoryStub, cryptoStub)
  return {
    sut,
    userRepositoryStub,
    cryptoStub
  }
}

describe('Sign In user', () => {
  it('should return an access token if correct params are passed', async () => {
    const { sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'getByEmail').mockReturnValueOnce(Promise.resolve({
      id: 'fake_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password-hash',
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    const result = await sut.execute('fake@mail.com', 'fake_password')
    expect(result).toBe('user_token')
  })
})
