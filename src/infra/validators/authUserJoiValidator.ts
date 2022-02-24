import Joi from 'joi'
import { Validator } from '@/controllers/validator'
import { AuthUserDto } from '@/usecases/dtos/users'

export class JoiValidator implements Validator<AuthUserDto> {
  private schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
      .min(6)
  })

  validate (data: AuthUserDto): boolean {
    const { email, password } = data
    const result = this.schema.validate({ email, password })
    if (result.error) {
      return false
    }
    return true
  }
}
