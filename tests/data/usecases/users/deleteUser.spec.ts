import { UserNotFoundError } from '@/data/error/users'
import { DeleteUser } from '@/data/usecases/users/deleteUser'
import { UserRepositoryStub } from '@test/stubs'

type sutTypes = {
  sut: DeleteUser
  userRepositoryStub: UserRepositoryStub
}

const makeSut = (): sutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new DeleteUser(userRepositoryStub)
  return {
    sut,
    userRepositoryStub
  }
}

describe('Delete user', () => {
  it('should call execute with correct id', async () => {
    const { sut } = makeSut()

    const result = await sut.execute('fake_id')
    expect(result).toBe('User fake_id deleted')
  })

  it('should throw UserNotFoundError if id is not found', async () => {
    const { sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null))

    await expect(sut.execute('wrong_id')).rejects.toThrow(new UserNotFoundError('User not found'))
  })
})
