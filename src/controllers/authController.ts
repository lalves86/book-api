import { AuthUserDto } from '@/usecases/dtos/users'
import { InvalidCredentialsError } from '@/usecases/error/users'
import { AuthenticateUser } from '@/usecases/users/authenticateUser'
import { HttpRequest, HttpResponse, HttpStatusCodes } from './types/http'
import { Validator } from './validator'

export class AuthController {
  constructor (
    private readonly validator: Validator<AuthUserDto>,
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async login (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      const isBodyComplete = requiredFields.every(field => httpRequest.body[field])
      if (!isBodyComplete) {
        return {
          httpStatusCode: HttpStatusCodes.badRequest.code,
          body: {
            message: 'Missing fields'
          }
        }
      }
      const isBodyValid = this.validator.validate(httpRequest.body)
      if (!isBodyValid) {
        return {
          httpStatusCode: HttpStatusCodes.badRequest.code,
          body: {
            message: 'Invalid fields'
          }
        }
      }
      const response = await this.authenticateUser.execute(httpRequest.body)
      return {
        httpStatusCode: HttpStatusCodes.ok.code,
        body: response
      }
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return {
          httpStatusCode: HttpStatusCodes.unauthorized.code,
          body: {
            message: error.message
          }
        }
      }

      return {
        httpStatusCode: HttpStatusCodes.serverError.code,
        body: error.message
      }
    }
  }
}
