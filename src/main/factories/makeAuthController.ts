import { AuthController } from '@/presentation/controllers/authController'
import { Validator } from '@/presentation/validator'
import { JwtAdapter } from '@/infra/accessToken/jwtAdapter'
import { BcryptAdapter } from '@/infra/cryptography/bcryptAdapter'
import { UserRepositoryMongoose } from '@/infra/repositories/implementations/userRepositoryMongoose'
import { JoiValidator } from '@/infra/validators/authUserJoiValidator'
import { AuthUserDto } from '@/data/dtos/users'
import { AccessToken } from '@/data/ports/authentication'
import { Crypto } from '@/data/ports/criptography'
import { UserRepository } from '@/data/ports/repositories'
import { AuthenticateUser } from '@/data/usecases/users/authenticateUser'

export const makeAuthController = (): AuthController => {
  const authRepository: UserRepository = new UserRepositoryMongoose()
  const validator: Validator<AuthUserDto> = new JoiValidator()
  const crypto: Crypto = new BcryptAdapter()
  const accessToken: AccessToken = new JwtAdapter()
  const authUser = new AuthenticateUser(authRepository, crypto, accessToken)

  return new AuthController(validator, authUser)
}
