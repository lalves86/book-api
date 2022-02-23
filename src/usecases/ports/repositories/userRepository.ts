import { User } from '@/domain/user'
import { CreateUserDto } from '@/usecases/dtos/users'

export interface UserRepository {
  create (user: CreateUserDto): Promise<User>
  getByEmail (email: string): Promise<User>
  findById (id: string): Promise<User>
}
