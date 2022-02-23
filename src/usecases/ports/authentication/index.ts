export interface AccessToken {
  sign (userId: string): Promise<string>
  verify (token: string): Promise<string>
}
