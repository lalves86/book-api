import { MailServiceError } from '@/data/error/mail/mailServiceError'
import { UserCreationMail } from '@/data/usecases/mailNotification/userCreationMail'
import { MailParserStub } from '@test/stubs/mailParserStub'
import { mailStub } from '@test/stubs/mailServiceStub'
import { QueueProducerStub } from '@test/stubs/queueProducerStub'

type SutTypes = {
  sut: UserCreationMail
  queueProducerStub: QueueProducerStub
  mailParserStub: MailParserStub
}

const makeSut = (): SutTypes => {
  const queueProducerStub = new QueueProducerStub()
  const mailParserStub = new MailParserStub()
  const sut = new UserCreationMail(mailStub, queueProducerStub, mailParserStub)
  return {
    sut,
    queueProducerStub,
    mailParserStub
  }
}

describe('UserCreationMail', () => {
  it('should add to queue when user is created', async () => {
    const { sut } = makeSut()

    const user = {
      username: 'To',
      email: 'to@mail.com',
      password: 'fake_password'
    }

    const result = await sut.execute(user)
    expect(result.to).toEqual(mailStub.to)
  })

  it('should throw if email service throws', async () => {
    const { sut, queueProducerStub } = makeSut()
    jest.spyOn(queueProducerStub, 'addToQueue').mockReturnValueOnce(Promise.resolve(null))

    const user = {
      username: 'fake_username',
      email: 'fake@mail.com',
      password: 'fake_password'
    }

    const promise = sut.execute(user)
    await expect(promise).rejects.toBeInstanceOf(MailServiceError)
  })
})
