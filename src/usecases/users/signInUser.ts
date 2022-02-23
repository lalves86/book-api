import { InvalidCredentialsError } from '../error/users'
import { Crypto } from '../ports/criptography'
import { UserRepository } from '../ports/repositories'

export class SignInUser {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly crypto: Crypto
  ) {}

  async execute (email: string, password: string): Promise<string> {
    const user = await this.userRepository.getByEmail(email)
    const isPasswordValid = await this.crypto.compare(password, user.password)
    if (!isPasswordValid || !user) {
      throw new InvalidCredentialsError('Invalid credentias.')
    }
    return 'user_token'
  }
}
