import { AccessToken } from '@/usecases/ports/authentication'
import { ListUserById } from '@/usecases/users/listUserById'
import { AccessDeniedError } from '../error/accessDeniedError'
import { Middleware } from '../ports/middleware'
import { HttpRequest } from '../types/http'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly accessToken: AccessToken,
    private readonly listUserById: ListUserById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<void> {
    const accessToken = httpRequest.headers.authorization
    if (!accessToken) {
      throw new AccessDeniedError('Missing access token')
    }
    const [, token] = accessToken.split(' ')
    const userId = await this.accessToken.verify(token)
    const user = await this.listUserById.execute(userId)
    if (!user) {
      throw new AccessDeniedError('Invalid access token')
    }
  }
}
