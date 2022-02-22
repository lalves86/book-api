import { CreateUserDto } from '@/usecases/dtos/users'
import { CreateUser } from '@/usecases/users/createUser'
import Mockdate from 'mockdate'
import { UserRepositoryStub } from '../stubs/userRepositoryStub'

type sutTypes = {
  sut: CreateUser
  userRepositoryStub: UserRepositoryStub
}

const makeSut = (): sutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new CreateUser(userRepositoryStub)
  return {
    sut,
    userRepositoryStub
  }
}

describe('CreateUser', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })
  it('should call book repository with correct params', async () => {
    const { sut } = makeSut()

    const fakeUser: CreateUserDto = {
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password'
    }

    const result = await sut.execute(fakeUser)
    expect(result.id).toBeDefined()
    expect(result.username).toBe(fakeUser.username)
    expect(result.email).toBe(fakeUser.email)
    expect(result.createdAt).toBeDefined()
  })
})
