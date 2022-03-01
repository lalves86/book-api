import { User } from '@/domain/user'
import { CreateUserDto, UpdateUserDto } from '@/data/dtos/users'

export interface UserRepository {
  create (data: CreateUserDto): Promise<User>
  getByEmail (email: string): Promise<User>
  findById (id: string): Promise<User>
  update (data: UpdateUserDto): Promise<User>
  delete (userId: string): Promise<string>
}
