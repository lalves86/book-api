import { AccessDeniedError } from '@/controllers/error/accessDeniedError'
import { AuthMiddleware } from '@/controllers/middlewares/authMiddleware'
import { ListUserById } from '@/usecases/users/listUserById'
import { AccessTokenStub, UserRepositoryStub } from '@test/usecases/stubs'

type SutTypes = {
  sut: AuthMiddleware
  accessTokenStub: AccessTokenStub
  listUserById: ListUserById
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const accessTokenStub = new AccessTokenStub()
  const listUserById = new ListUserById(userRepositoryStub)
  const sut = new AuthMiddleware(accessTokenStub, listUserById)
  return {
    sut,
    accessTokenStub,
    listUserById
  }
}

describe('Auth middleware', () => {
  it('should find a valid user if token is correct', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      headers: {
        authorization: 'Bearer fake_token'
      }
    }

    await expect(sut.handle(httpRequest)).resolves.toBeUndefined()
  })

  it('should throw access denied error if token is not passed', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      headers: {
        authorization: ''
      }
    }

    await expect(sut.handle(httpRequest)).rejects.toEqual(new AccessDeniedError('Missing access token'))
  })

  it('should throw access denied error if user token is wrong', async () => {
    const { sut, listUserById } = makeSut()
    jest.spyOn(listUserById, 'execute').mockReturnValueOnce(Promise.resolve(null))

    const httpRequest = {
      headers: {
        authorization: 'Bearer wrong_token'
      }
    }

    await expect(sut.handle(httpRequest)).rejects.toEqual(new AccessDeniedError('Invalid access token'))
  })
})
