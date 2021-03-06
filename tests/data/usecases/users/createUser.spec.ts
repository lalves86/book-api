import { CreateUserDto } from '@/data/dtos/users'
import { UserAlreadyExistsError } from '@/data/error/users'
import { UserCreationMail } from '@/data/usecases/mailNotification/userCreationMail'
import { CreateUser } from '@/data/usecases/users/createUser'
import Mockdate from 'mockdate'
import { CryptoStub } from '@test/stubs/cryptoStub'
import { MailParserStub } from '@test/stubs/mailParserStub'
import { mailStub } from '@test/stubs/mailServiceStub'
import { QueueProducerStub } from '@test/stubs/queueProducerStub'
import { UserRepositoryStub } from '@test/stubs'

type sutTypes = {
  sut: CreateUser
  userRepositoryStub: UserRepositoryStub
  cryptoStub: CryptoStub
}

const makeSut = (): sutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const cryptoStub = new CryptoStub()
  const queueProducerStub = new QueueProducerStub()
  const mailParserStub = new MailParserStub()
  const userCreationMail = new UserCreationMail(mailStub, queueProducerStub, mailParserStub)
  const sut = new CreateUser(userRepositoryStub, cryptoStub, userCreationMail)
  return {
    sut,
    userRepositoryStub,
    cryptoStub
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
    expect(result.password).toBe(fakeUser.password)
    expect(result.createdAt).toBeDefined()
  })

  it('should not allow two users with the same email', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const fakeUser: CreateUserDto = {
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password'
    }
    jest.spyOn(userRepositoryStub, 'getByEmail').mockReturnValueOnce(Promise.resolve({
      id: 'fake_id',
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    const promise = sut.execute(fakeUser)

    await expect(promise).rejects.toThrow(UserAlreadyExistsError)
  })
})
