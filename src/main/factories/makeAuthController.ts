import { AuthController } from '@/controllers/authController'
import { Validator } from '@/controllers/validator'
import { JwtAdapter } from '@/infra/accessToken/jwtAdapter'
import { BcryptAdapter } from '@/infra/cryptography/bcryptAdapter'
import { UserRepositoryMongoose } from '@/infra/repositories/implementations/userRepositoryMongoose'
import { JoiValidator } from '@/infra/validators/authUserJoiValidator'
import { AuthUserDto } from '@/usecases/dtos/users'
import { AccessToken } from '@/usecases/ports/authentication'
import { Crypto } from '@/usecases/ports/criptography'
import { UserRepository } from '@/usecases/ports/repositories'
import { AuthenticateUser } from '@/usecases/users/authenticateUser'

export const makeAuthController = (): AuthController => {
  const authRepository: UserRepository = new UserRepositoryMongoose()
  const validator: Validator<AuthUserDto> = new JoiValidator()
  const crypto: Crypto = new BcryptAdapter()
  const accessToken: AccessToken = new JwtAdapter()
  const authUser = new AuthenticateUser(authRepository, crypto, accessToken)

  return new AuthController(validator, authUser)
}
