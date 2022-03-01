import { UserController } from '@/presentation/controllers/userController'
import { Validator } from '@/presentation/validator'
import { BcryptAdapter } from '@/infra/cryptography/bcryptAdapter'
import { UserRepositoryMongoose } from '@/infra/repositories/implementations/userRepositoryMongoose'
import { JoiValidator } from '@/infra/validators/createUserJoiValidator'
import { NodemailerAdapter } from '@/infra/mailService/nodemailerAdapter'
import { CreateUserDto } from '@/data/dtos/users'
import { Crypto } from '@/data/ports/criptography'
import { UserRepository } from '@/data/ports/repositories'
import { CreateUser } from '@/data/usecases/users/createUser'
import { ListUserById } from '@/data/usecases/users/listUserById'
import { UpdateUser } from '@/data/usecases/users/updateUser'
import { DeleteUser } from '@/data/usecases/users/deleteUser'
import { UserCreationMail } from '@/data/usecases/mailNotification/userCreationMail'
import { nodemailerConfig } from '../config/nodemailerConfig'

export const makeUserController = (): UserController => {
  const validator: Validator<CreateUserDto> = new JoiValidator()
  const crypto: Crypto = new BcryptAdapter()
  const userRepository: UserRepository = new UserRepositoryMongoose()
  const mailService = new NodemailerAdapter()
  const userCreationMail = new UserCreationMail(nodemailerConfig(), mailService)
  const createUser = new CreateUser(userRepository, crypto, userCreationMail)
  const listUserById = new ListUserById(userRepository)
  const updateUser = new UpdateUser(userRepository, crypto)
  const deleteUser = new DeleteUser(userRepository)

  return new UserController(validator, createUser, listUserById, updateUser, deleteUser)
}
