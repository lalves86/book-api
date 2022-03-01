import { User } from '@/domain/user'
import { userModel } from '@/infra/databases/mongodb/model/userModel'
import { CreateUserDto, UpdateUserDto } from '@/data/dtos/users'
import { UserRepository } from '@/data/ports/repositories'

export class UserRepositoryMongoose implements UserRepository {
  async create (data: CreateUserDto): Promise<User> {
    const user = await userModel.create(data)
    return user
  }

  async getByEmail (email: string): Promise<User> {
    const user = await userModel.findOne({ email })
    return user
  }

  async findById (id: string): Promise<User> {
    const user = await userModel.findById(id)
    return user
  }

  async update (data: UpdateUserDto): Promise<User> {
    const user = await userModel.findOneAndUpdate({ _id: data.id }, data, {
      new: true
    })
    return user
  }

  async delete (userId: string): Promise<string> {
    await userModel.findByIdAndDelete(userId)
    return `User with id ${userId} deleted`
  }
}
