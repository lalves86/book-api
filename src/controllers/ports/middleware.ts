import { HttpRequest } from '../types/http'

export interface Middleware{
  handle (httpRequest: HttpRequest): Promise<void>
}
