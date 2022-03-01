import Joi from 'joi'
import { Validator } from '@/presentation/validator'
import { AuthUserDto } from '@/data/dtos/users'

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
