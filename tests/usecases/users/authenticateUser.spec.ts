import { AuthUserDto } from '@/usecases/dtos/users'
import { InvalidCredentialsError } from '@/usecases/error/users'
import { AuthenticateUser } from '@/usecases/users/authenticateUser'
import { AccessTokenStub } from '../stubs/accessTokenStub'
import { CryptoStub } from '../stubs/cryptoStub'
import { UserRepositoryStub } from '../stubs/userRepositoryStub'

type sutTypes = {
  sut: AuthenticateUser
  userRepositoryStub: UserRepositoryStub
  cryptoStub: CryptoStub
  accessTokenStub: AccessTokenStub
}

const makeSut = (): sutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const cryptoStub = new CryptoStub()
  const accessTokenStub = new AccessTokenStub()
  const sut = new AuthenticateUser(userRepositoryStub, cryptoStub, accessTokenStub)
  return {
    sut,
    userRepositoryStub,
    cryptoStub,
    accessTokenStub
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

    const authParams: AuthUserDto = {
      email: 'fake@mail.com',
      password: 'fake_password'
    }

    const result = await sut.execute(authParams)
    expect(result).toBe('fake_id-token')
  })

  it('should return an InvalidCredentialsError if email or password are wrong', async () => {
    const { sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'getByEmail').mockReturnValueOnce(Promise.resolve({
      id: 'fake_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password-hash',
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    const authParams: AuthUserDto = {
      email: 'fake@mail.com',
      password: 'wrong_password'
    }

    await expect(sut.execute(authParams))
      .rejects.toThrow(new InvalidCredentialsError('Invalid credentials.'))
  })
})
