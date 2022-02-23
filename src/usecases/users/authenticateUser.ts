import { User } from '@/domain/user'
import { AuthUserDto } from '../dtos/users'
import { InvalidCredentialsError } from '../error/users'
import { AccessToken } from '../ports/authentication'
import { Crypto } from '../ports/criptography'
import { UserRepository } from '../ports/repositories'
import { UseCase } from '../ports/usecase'

export class AuthenticateUser implements UseCase<User> {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly crypto: Crypto,
    private readonly accessToken: AccessToken
  ) {}

  async execute (user: AuthUserDto): Promise<string> {
    const userExists = await this.userRepository.getByEmail(user.email)
    const isPasswordValid = await this.crypto.compare(user.password, userExists.password)
    if (!isPasswordValid || !userExists) {
      throw new InvalidCredentialsError('Invalid credentials.')
    }
    const token = await this.accessToken.sign(userExists.id)
    return token
  }
}
