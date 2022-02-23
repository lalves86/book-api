import Mockdate from 'mockdate'
import { UserController } from '@/controllers/userController'
import { CreateUser } from '@/usecases/users/createUser'
import { UserRepositoryStub, ValidatorStub, CryptoStub } from '@test/usecases/stubs'
import { HttpStatusCodes } from '@/controllers/types/http'
import { ServerError } from '@/controllers/error/serverError'
import { UserAlreadyExistsError } from '@/usecases/error/users'

type SutTypes = {
  sut: UserController
  createUser: CreateUser
  validatorStub: ValidatorStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const cryptoStub = new CryptoStub()
  const validatorStub = new ValidatorStub()
  const createUser = new CreateUser(userRepositoryStub, cryptoStub)
  const sut = new UserController(validatorStub, createUser)
  return {
    sut,
    createUser,
    validatorStub
  }
}

describe('User controller', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  describe('create', () => {
    it('should call createUser with correct params', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          username: 'fake_username',
          email: 'fake@mail.com',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.create(httpRequest)
      expect(httpResponse.body.username).toEqual(httpRequest.body.username)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.created.code)
    })

    it('should return a server error if usecase throws', async () => {
      const { sut, createUser } = makeSut()
      jest.spyOn(createUser, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))

      const httpRequest = {
        body: {
          username: 'fake_username',
          email: 'fake@mail.com',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.create(httpRequest)
      expect(httpResponse.body).toEqual('Internal Server Error')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
    })

    it('should return a bad request if email already exists', async () => {
      const { sut, createUser } = makeSut()
      jest.spyOn(createUser, 'execute').mockReturnValueOnce(Promise.reject(new UserAlreadyExistsError('This e-mail address is already in use.')))

      const httpRequest = {
        body: {
          username: 'fake_username',
          email: 'fake@mail.com',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.create(httpRequest)
      expect(httpResponse.body.message).toEqual('This e-mail address is already in use.')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    })

    it('should return a bad request if mandatory param is missing', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          email: 'fake@mail.com',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.create(httpRequest)
      expect(httpResponse.body.message).toEqual('Missing fields')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    })

    it('should return a bad request if data validation fails', async () => {
      const { sut, validatorStub } = makeSut()
      jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(false)

      const httpRequest = {
        body: {
          username: 'fake_username',
          email: 'invalid_mail',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.create(httpRequest)
      expect(httpResponse.body.message).toEqual('Invalid fields')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    })
  })
})
