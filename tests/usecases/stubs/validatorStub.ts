import { Validator } from '@/controllers/validator'
import { CreateUserDto } from '@/usecases/dtos/users'

export class ValidatorStub implements Validator<CreateUserDto> {
  validate (data: CreateUserDto): boolean {
    return true
  }
}
