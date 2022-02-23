import { AuthController } from '@/controllers/authController'
import { HttpStatusCodes } from '@/controllers/types/http'
import { AuthenticateUser } from '@/usecases/users/authenticateUser'
import { CryptoStub, UserRepositoryStub, ValidatorStub, AccessTokenStub } from '@test/usecases/stubs'

type SutTypes = {
  sut: AuthController,
  userRepositoryStub: UserRepositoryStub,
  authenticateUser: AuthenticateUser,
  validatorStub: ValidatorStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const cryptoStub = new CryptoStub()
  const validatorStub = new ValidatorStub()
  const accessTokenStub = new AccessTokenStub()
  const authenticateUser = new AuthenticateUser(userRepositoryStub, cryptoStub, accessTokenStub)
  const sut = new AuthController(validatorStub, authenticateUser)
  return {
    sut,
    userRepositoryStub,
    authenticateUser,
    validatorStub
  }
}

describe('Auth controller', () => {
  it('should authenticate user if correct params are passed', async () => {
    const { sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'getByEmail').mockReturnValueOnce(Promise.resolve({
      id: 'fake_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password-hash',
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    const httpRequest = {
      body: {
        email: 'fake@mail.com',
        password: 'fake_password'
      }
    }
    const response = await sut.login(httpRequest)
    expect(response.httpStatusCode).toEqual(HttpStatusCodes.ok.code)
    expect(response.body).toEqual('fake_id-token')
  })
})
