import { AccessToken } from '@/data/ports/authentication'
import { ListUserById } from '@/data/usecases/users/listUserById'
import { Middleware } from '../ports/middleware'
import { HttpRequest, HttpResponse, HttpStatusCodes } from '../types/http'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly accessToken: AccessToken,
    private readonly listUserById: ListUserById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
      return {
        httpStatusCode: HttpStatusCodes.ok.code,
        body: {
          id: user.id
        }
      }
    } catch (error) {
      return {
        httpStatusCode: HttpStatusCodes.forbidden.code,
        body: {
          message: error.message
        }
      }
    }
  }
}
