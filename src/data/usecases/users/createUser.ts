import { User } from '@/domain/user'
import { UserRepository } from '@/data/ports/repositories'
import { CreateUserDto } from '../../dtos/users'
import { UserAlreadyExistsError } from '../../error/users'
import { Crypto } from '../../ports/criptography'
import { UseCase } from '../../ports/usecase'
import { UserCreationMail } from '../mailNotification/userCreationMail'

export class CreateUser implements UseCase<User> {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly crypto: Crypto,
    private readonly userCreationMail: UserCreationMail
  ) {}

  async execute (user: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.getByEmail(user.email)
    if (userExists) {
      throw new UserAlreadyExistsError('This e-mail address is already in use.')
    }
    user.password = await this.crypto.hash(user.password)
    const newUser = await this.userRepository.create(user)
    await this.userCreationMail.execute(newUser)
    return newUser
  }
}
