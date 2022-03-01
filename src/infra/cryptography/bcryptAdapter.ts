import { Crypto } from '@/data/ports/criptography'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Crypto {
  private readonly saltRounds = 10

  async hash (plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.saltRounds)
  }

  async compare (plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash)
  }
}
