import { User } from '@/domain/user'
import { UserNotFoundError } from '../error/users/userNotFoundError'
import { UserRepository } from '../ports/repositories'
import { UseCase } from '../ports/usecase'

export class DeleteUser implements UseCase<User> {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async execute (userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundError('User not found')
    }
    await this.userRepository.delete(userId)
    return `User ${userId} deleted`
  }
}
