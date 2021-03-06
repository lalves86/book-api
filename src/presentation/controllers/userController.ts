import { CreateUserDto } from '@/data/dtos/users'
import { MailServiceError } from '@/data/error/mail/mailServiceError'
import { UserAlreadyExistsError, UserNotFoundError } from '@/data/error/users'
import { CreateUser } from '@/data/usecases/users/createUser'
import { DeleteUser } from '@/data/usecases/users/deleteUser'
import { ListUserById } from '@/data/usecases/users/listUserById'
import { UpdateUser } from '@/data/usecases/users/updateUser'
import { HttpRequest, HttpResponse, HttpStatusCodes } from '../types/http'
import { Validator } from '../validator'

export class UserController {
  constructor (
    private readonly validator: Validator<CreateUserDto>,
    private readonly createUser: CreateUser,
    private readonly listUserById: ListUserById,
    private readonly updateUser: UpdateUser,
    private readonly deleteUser: DeleteUser
  ) {}

  async create (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['username', 'email', 'password']
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
      const response = await this.createUser.execute(httpRequest.body)
      return {
        httpStatusCode: HttpStatusCodes.created.code,
        body: response
      }
    } catch (error) {
      if (error instanceof UserAlreadyExistsError || error instanceof MailServiceError) {
        return {
          httpStatusCode: HttpStatusCodes.badRequest.code,
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

  async show (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const response = await this.listUserById.execute(httpRequest.params.id)
      return {
        httpStatusCode: HttpStatusCodes.ok.code,
        body: response
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return {
          httpStatusCode: HttpStatusCodes.badRequest.code,
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

  async update (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['username', 'email', 'password']
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
      const { userId } = httpRequest
      const { body } = httpRequest
      const response = await this.updateUser.execute({ id: userId, ...body })
      return {
        httpStatusCode: HttpStatusCodes.ok.code,
        body: response
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return {
          httpStatusCode: HttpStatusCodes.badRequest.code,
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

  async delete (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest
      const response = await this.deleteUser.execute(userId)
      return {
        httpStatusCode: HttpStatusCodes.ok.code,
        body: response
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return {
          httpStatusCode: HttpStatusCodes.badRequest.code,
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
