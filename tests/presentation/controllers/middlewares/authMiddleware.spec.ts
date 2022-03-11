import { AuthMiddleware } from '@/presentation/middlewares/authMiddleware'
import { HttpStatusCodes } from '@/presentation/types/http'
import { ListUserById } from '@/data/usecases/users/listUserById'
import { AccessTokenStub, UserRepositoryStub } from '@test/stubs'

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

    const response = await sut.handle(httpRequest)

    expect(response.body.id).toBe('fake_id')
    expect(response.httpStatusCode).toBe(HttpStatusCodes.ok.code)
  })

  it('should throw access denied error if token is not passed', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      headers: {
        authorization: ''
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.body.message).toEqual('Missing access token')
    expect(response.httpStatusCode).toEqual(HttpStatusCodes.unauthorized.code)
  })

  it('should throw access denied error if user token is wrong', async () => {
    const { sut, accessTokenStub } = makeSut()
    jest.spyOn(accessTokenStub, 'verify').mockReturnValueOnce(Promise.reject(new Error()))

    const httpRequest = {
      headers: {
        authorization: 'Bearer wrong_token'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.httpStatusCode).toEqual(HttpStatusCodes.forbidden.code)
  })
})
