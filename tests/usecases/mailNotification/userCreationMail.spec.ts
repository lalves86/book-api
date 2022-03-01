import { MailServiceError } from '@/data/error/mail/mailServiceError'
import { UserCreationMail } from '@/data/usecases/mailNotification/userCreationMail'
import { MailParserStub } from '../stubs/mailParserStub'
import { MailServiceStub, mailStub } from '../stubs/mailServiceStub'

type SutTypes = {
  sut: UserCreationMail
  mailServiceStub: MailServiceStub
  mailParserStub: MailParserStub
}

const makeSut = (): SutTypes => {
  const mailServiceStub = new MailServiceStub()
  const mailParserStub = new MailParserStub()
  const sut = new UserCreationMail(mailStub, mailServiceStub, mailParserStub)
  return {
    sut,
    mailServiceStub,
    mailParserStub
  }
}

describe('UserCreationMail', () => {
  it('should send an email when user is created', async () => {
    const { sut } = makeSut()

    const user = {
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password'
    }

    const result = await sut.execute(user)
    expect(result.to).toEqual(mailStub.to)
  })

  it('should throw if email service throws', async () => {
    const { sut, mailServiceStub } = makeSut()
    jest.spyOn(mailServiceStub, 'send').mockReturnValueOnce(Promise.resolve(null))

    const user = {
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password'
    }

    const promise = sut.execute(user)
    await expect(promise).rejects.toBeInstanceOf(MailServiceError)
  })
})
