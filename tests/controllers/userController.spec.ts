import Mockdate from 'mockdate'
import { UserController } from '@/presentation/controllers/userController'
import { CreateUser } from '@/data/usecases/users/createUser'
import { UserRepositoryStub, ValidatorStub, CryptoStub } from '@test/usecases/stubs'
import { HttpStatusCodes } from '@/presentation/types/http'
import { ServerError } from '@/presentation/error/serverError'
import { UserAlreadyExistsError } from '@/data/error/users'
import { ListUserById } from '@/data/usecases/users/listUserById'
import { UserNotFoundError } from '@/data/error/users/userNotFoundError'
import { UpdateUser } from '@/data/usecases/users/updateUser'
import { DeleteUser } from '@/data/usecases/users/deleteUser'

type SutTypes = {
  sut: UserController
  createUser: CreateUser
  listUserById: ListUserById
  updateUser: UpdateUser
  deleteUser: DeleteUser
  validatorStub: ValidatorStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const cryptoStub = new CryptoStub()
  const validatorStub = new ValidatorStub()
  const createUser = new CreateUser(userRepositoryStub, cryptoStub)
  const listUserById = new ListUserById(userRepositoryStub)
  const updateUser = new UpdateUser(userRepositoryStub, cryptoStub)
  const deleteUser = new DeleteUser(userRepositoryStub)
  const sut = new UserController(validatorStub, createUser, listUserById, updateUser, deleteUser)
  return {
    sut,
    createUser,
    listUserById,
    updateUser,
    deleteUser,
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

  describe('updateUser', () => {
    it('should call updateUser with correct params', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        userId: 'fake_user_id',
        body: {
          username: 'fake_username',
          email: 'fake@mail.com',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.body.username).toEqual('fake_username')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.ok.code)
    })

    it('should throw server error if usecase throws', async () => {
      const { sut, updateUser } = makeSut()
      jest.spyOn(updateUser, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))

      const httpRequest = {
        userId: 'fake_user_id',
        body: {
          username: 'fake_username',
          email: 'fake@mail.com',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.body).toEqual('Internal Server Error')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
    })

    it('should return a bad request if user id is not found', async () => {
      const { sut, updateUser } = makeSut()
      jest.spyOn(updateUser, 'execute').mockReturnValueOnce(Promise.reject(new UserNotFoundError('User not found')))

      const httpRequest = {
        userId: 'wrong_user_id',
        body: {
          username: 'fake_username',
          email: 'fake@mail.com',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.body.message).toEqual('User not found')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    })

    it('should return a bad request if mandatory param is missing', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        userId: 'fake_user_id',
        body: {
          email: 'fake@mail.com',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.body.message).toEqual('Missing fields')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    })

    it('should return a bad request if data validation fails', async () => {
      const { sut, validatorStub } = makeSut()
      jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(false)

      const httpRequest = {
        userId: 'fake_user_id',
        body: {
          username: 'fake_username',
          email: 'invalid_mail',
          password: 'fake_password'
        }
      }

      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.body.message).toEqual('Invalid fields')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    })
  })

  describe('deleteUser', () => {
    it('should call delete user with correct params', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        userId: 'fake_id'
      }

      const httpResponse = await sut.delete(httpRequest)
      expect(httpResponse.body).toEqual('User fake_id deleted')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.ok.code)
    })

    it('should throw server error if usecase throws', async () => {
      const { sut, deleteUser } = makeSut()
      jest.spyOn(deleteUser, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))

      const httpRequest = {
        userId: 'fake_id'
      }

      const httpResponse = await sut.delete(httpRequest)
      expect(httpResponse.body).toEqual('Internal Server Error')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
    })

    it('should return a bad request if user id is not found', async () => {
      const { sut, deleteUser } = makeSut()
      jest.spyOn(deleteUser, 'execute').mockReturnValueOnce(Promise.reject(new UserNotFoundError('User not found')))

      const httpRequest = {
        userId: 'wrong_user_id'
      }

      const httpResponse = await sut.delete(httpRequest)
      expect(httpResponse.body.message).toEqual('User not found')
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
    })
  })
})
