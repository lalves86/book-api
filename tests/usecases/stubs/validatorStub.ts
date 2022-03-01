import { Validator } from '@/presentation/validator'
import { CreateUserDto } from '@/data/dtos/users'

export class ValidatorStub implements Validator<CreateUserDto> {
  validate (data: CreateUserDto): boolean {
    return true
  }
}
