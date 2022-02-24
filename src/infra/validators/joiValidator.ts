import Joi from 'joi'
import { Validator } from '@/controllers/validator'
import { CreateUserDto } from '@/usecases/dtos/users'

export class JoiValidator implements Validator<CreateUserDto> {
  private schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
      .min(6)
  })

  validate (data: CreateUserDto): boolean {
    const { username, email, password } = data
    const result = this.schema.validate({ username, email, password })
    if (result.error) {
      return false
    }
    return true
  }
}
