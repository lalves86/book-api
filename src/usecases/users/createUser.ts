import { User } from '@/domain/user'
import { UserRepository } from '@/infra/repositories/ports/userRepository'
import { CreateUserDto } from '../dtos/users'
import { UserAlreadyExistsError } from '../error/users'
import { UseCase } from '../ports/usecase'

export class CreateUser implements UseCase<User> {
  constructor (private userRepository: UserRepository) {}

  async execute (user: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.getByEmail(user.email)
    if (userExists) {
      throw new UserAlreadyExistsError('This e-mail address is already in use.')
    }
    const newUser = await this.userRepository.create(user)
    return newUser
  }
}
