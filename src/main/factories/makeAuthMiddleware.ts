import { AuthMiddleware } from '@/presentation/middlewares/authMiddleware'
import { Middleware } from '@/presentation/ports/middleware'
import { JwtAdapter } from '@/infra/accessToken/jwtAdapter'
import { UserRepositoryMongoose } from '@/infra/repositories/implementations/userRepositoryMongoose'
import { AccessToken } from '@/data/ports/authentication'
import { ListUserById } from '@/data/usecases/users/listUserById'

export const makeAuthMiddleware = (): Middleware => {
  const userRepository = new UserRepositoryMongoose()
  const accessToken: AccessToken = new JwtAdapter()
  const listUserById = new ListUserById(userRepository)
  return new AuthMiddleware(accessToken, listUserById)
}
