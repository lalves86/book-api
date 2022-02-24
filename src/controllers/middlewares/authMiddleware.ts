import { AccessToken } from '@/usecases/ports/authentication'
import { ListUserById } from '@/usecases/users/listUserById'
import { Middleware } from '../ports/middleware'
import { HttpRequest, HttpResponse, HttpStatusCodes } from '../types/http'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly accessToken: AccessToken,
    private readonly listUserById: ListUserById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers.authorization
    if (!accessToken) {
      return {
        httpStatusCode: HttpStatusCodes.unauthorized.code,
        body: {
          message: 'Missing access token'
        }
      }
    }
    const [, token] = accessToken.split(' ')
    const userId = await this.accessToken.verify(token)
    const user = await this.listUserById.execute(userId)
    if (!user) {
      return {
        httpStatusCode: HttpStatusCodes.forbidden.code,
        body: {
          message: 'Invalid access token'
        }
      }
    }
    return {
      httpStatusCode: HttpStatusCodes.ok.code,
      body: {
        id: user.id
      }
    }
  }
}
