import Mockdate from 'mockdate'
import { UserController } from '@/controllers/userController'
import { CreateUser } from '@/usecases/users/createUser'
import { UserRepositoryStub, ValidatorStub, CryptoStub } from '@test/usecases/stubs'
import { HttpStatusCodes } from '@/controllers/types/http'
import { ServerError } from '@/controllers/error/serverError'
import { UserAlreadyExistsError } from '@/usecases/error/users'
import { ListUserById } from '@/usecases/users/listUserById'
import { UserNotFoundError } from '@/usecases/error/users/userNotFoundError'

type SutTypes = {
  sut: UserController
  createUser: CreateUser
  listUserById: ListUserById
  validatorStub: ValidatorStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const cryptoStub = new CryptoStub()
  const validatorStub = new ValidatorStub()
  const createUser = new CreateUser(userRepositoryStub, cryptoStub)
  const listUserById = new ListUserById(userRepositoryStub)
  const sut = new UserController(validatorStub, createUser, listUserById)
  return {
    sut,
    createUser,
    listUserById,
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

  describe('listUserById', () => {
    it('should call listUserById with correct params', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        params: {
          userId: 'fake_user_id'
        }
      }

      const httpResponse = await sut.show(httpRequest)
      expect(httpResponse.body.username).toEqual('fake_username')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.ok.code)
    })

    it('should throw server error if usecase throws', async () => {
      const { sut, listUserById } = makeSut()
      jest.spyOn(listUserById, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))

      const httpRequest = {
        params: {
          userId: 'fake_user_id'
        }
      }

      const httpResponse = await sut.show(httpRequest)
      expect(httpResponse.body).toEqual('Internal Server Error')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
    })

    it('should return a bad request if user id is not found', async () => {
      const { sut, listUserById } = makeSut()
      jest.spyOn(listUserById, 'execute').mockReturnValueOnce(Promise.reject(new UserNotFoundError('User not found')))

      const httpRequest = {
        params: {
          userId: 'wrong_user_id'
        }
      }

      const httpResponse = await sut.show(httpRequest)
      expect(httpResponse.body.message).toEqual('User not found')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    })
  })
})
