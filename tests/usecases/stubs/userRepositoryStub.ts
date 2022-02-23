import { User } from '@/domain/user'
import { UserRepository } from '@/usecases/ports/repositories'
import { CreateUserDto } from '@/usecases/dtos/users'

export class UserRepositoryStub implements UserRepository {
  async create (user: CreateUserDto): Promise<User> {
    return Promise.resolve({
      id: 'fake_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password-hash',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async getByEmail (email: string): Promise<User> {
    return Promise.resolve(null)
  }

  async findById (userId: string): Promise<User> {
    return Promise.resolve({
      id: 'fake_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password-hash',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
}
