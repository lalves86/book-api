import { AuthController } from '@/controllers/authController'
import { ServerError } from '@/controllers/error/serverError'
import { HttpStatusCodes } from '@/controllers/types/http'
import { InvalidCredentialsError } from '@/usecases/error/users'
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

  it('should throw a server error if usecase throws', async () => {
    const { sut, authenticateUser } = makeSut()
    jest.spyOn(authenticateUser, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))

    const httpRequest = {
      body: {
        email: 'fake@mail.com',
        password: 'fake_password'
      }
    }
    const response = await sut.login(httpRequest)
    expect(response.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
    expect(response.body).toEqual('Internal Server Error')
  })

  it('should throw an unauthorized error if invalid credentials are passed', async () => {
    const { sut, authenticateUser } = makeSut()
    jest.spyOn(authenticateUser, 'execute').mockReturnValueOnce(Promise.reject(new InvalidCredentialsError('Invalid credentials.')))

    const httpRequest = {
      body: {
        email: 'wrong@mail.com',
        password: 'fake_password'
      }
    }
    const response = await sut.login(httpRequest)
    expect(response.httpStatusCode).toEqual(HttpStatusCodes.unauthorized.code)
    expect(response.body.message).toEqual('Invalid credentials.')
  })

  it('should throw an unauthorized error if invalid credentials are passed', async () => {
    const { sut, authenticateUser } = makeSut()
    jest.spyOn(authenticateUser, 'execute').mockReturnValueOnce(Promise.reject(new InvalidCredentialsError('Invalid credentials.')))

    const httpRequest = {
      body: {
        email: 'wrong@mail.com',
        password: 'fake_password'
      }
    }
    const response = await sut.login(httpRequest)
    expect(response.httpStatusCode).toEqual(HttpStatusCodes.unauthorized.code)
    expect(response.body.message).toEqual('Invalid credentials.')
  })

  it('should throw a bad request if a required field is missing', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'fake_password'
      }
    }
    const response = await sut.login(httpRequest)
    expect(response.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    expect(response.body.message).toEqual('Missing fields')
  })

  it('should throw a bad request if validation does not match', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        password: 'fake_password'
      }
    }
    const response = await sut.login(httpRequest)
    expect(response.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    expect(response.body.message).toEqual('Missing fields')
  })
})
