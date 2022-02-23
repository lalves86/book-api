import { InvalidCredentialsError } from '../error/users'
import { AccessToken } from '../ports/authentication'
import { Crypto } from '../ports/criptography'
import { UserRepository } from '../ports/repositories'

export class AuthenticateUser {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly crypto: Crypto,
    private readonly accessToken: AccessToken
  ) {}

  async execute (email: string, password: string): Promise<string> {
    const user = await this.userRepository.getByEmail(email)
    const isPasswordValid = await this.crypto.compare(password, user.password)
    if (!isPasswordValid || !user) {
      throw new InvalidCredentialsError('Invalid credentials.')
    }
    const token = await this.accessToken.sign(user.id)
    return token
  }
}
