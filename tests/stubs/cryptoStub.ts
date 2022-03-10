import { Crypto } from '@/data/ports/criptography'

export class CryptoStub implements Crypto {
  async hash (plaintext: string): Promise<string> {
    return plaintext + '-hash'
  }

  async compare (plaintext: string, hash: string): Promise<boolean> {
    const decodedHash = hash.replace('-hash', '')
    return plaintext === decodedHash
  }
}
