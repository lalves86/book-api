import { User } from '@/domain/user'
import { UserRepository } from '@/infra/repositories/ports/userRepository'
import { CreateUserDto } from '@/usecases/dtos/users'

export class UserRepositoryStub implements UserRepository {
  async create (user: CreateUserDto): Promise<User> {
    return Promise.resolve({
      id: 'fake_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
}
