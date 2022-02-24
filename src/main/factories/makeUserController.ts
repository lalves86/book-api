import { UserController } from '@/controllers/userController'
import { Validator } from '@/controllers/validator'
import { BcryptAdapter } from '@/infra/cryptography/bcryptAdapter'
import { UserRepositoryMongoose } from '@/infra/repositories/implementations/userRepositoryMongoose'
import { JoiValidator } from '@/infra/validators/joiValidator'
import { CreateUserDto } from '@/usecases/dtos/users'
import { Crypto } from '@/usecases/ports/criptography'
import { UserRepository } from '@/usecases/ports/repositories'
import { CreateUser } from '@/usecases/users/createUser'

export const makeUserController = (): UserController => {
  const validator: Validator<CreateUserDto> = new JoiValidator()
  const crypto: Crypto = new BcryptAdapter()
  const userRepository: UserRepository = new UserRepositoryMongoose()
  const createUser = new CreateUser(userRepository, crypto)

  return new UserController(validator, createUser)
}
