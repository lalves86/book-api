import { AccessToken } from '@/data/ports/authentication'

export class AccessTokenStub implements AccessToken {
  async sign (userId: string): Promise<string> {
    return userId + '-token'
  }

  async verify (token: string): Promise<string> {
    const decodedUser = token.replace('-token', '')
    return decodedUser
  }
}
