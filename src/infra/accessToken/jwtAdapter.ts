import jwt from 'jsonwebtoken'
import { AccessToken } from '@/usecases/ports/authentication'

export class JwtAdapter implements AccessToken {
  sign (userId: string): Promise<string> {
    const token = jwt.sign({ userId }, 'secret', { expiresIn: '7d' })
    return Promise.resolve(token)
  }

  verify (token: string): Promise<string> {
    const { userId } = jwt.verify(token, 'secret') as { userId: string }
    return Promise.resolve(userId)
  }
}
