import { User } from '@/domain/user'
import { UserRepository } from '@/infra/repositories/ports/userRepository'
import { CreateUserDto } from '../dtos/users'
import { UseCase } from '../ports/usecase'

export class CreateUser implements UseCase<User> {
  constructor (private userRepository: UserRepository) {}

  async execute (user: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(user)
    return newUser
  }
}
