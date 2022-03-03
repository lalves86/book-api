import jwt from 'jsonwebtoken'
import { AccessToken } from '@/data/ports/authentication'

export class JwtAdapter implements AccessToken {
  sign (userId: string): Promise<string> {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })
    return Promise.resolve(token)
  }

  verify (token: string): Promise<string> {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as { userId: string }
    return Promise.resolve(userId)
  }
}
