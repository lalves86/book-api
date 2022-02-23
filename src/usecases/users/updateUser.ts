import { User } from '@/domain/user'
import { UpdateUserDto } from '../dtos/users'
import { UserNotFoundError } from '../error/users/userNotFoundError'
import { Crypto } from '../ports/criptography'
import { UserRepository } from '../ports/repositories'
import { UseCase } from '../ports/usecase'

export class UpdateUser implements UseCase<User> {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly cryptoStub: Crypto
  ) {}

  async execute (data: UpdateUserDto) {
    const user = await this.userRepository.findById(data.id)
    if (!user) {
      throw new UserNotFoundError('User not found')
    }
    const hashedPassword = await this.cryptoStub.hash(data.password)
    data.password = hashedPassword
    const updatedUser = await this.userRepository.update(data)
    return updatedUser
  }
}
