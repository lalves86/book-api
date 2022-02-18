type BookStatus = 'Wanna read' | 'Reading' | 'Read'

export class CreateBookDto {
  title: string
  author: string
  finishedAt?: Date
  grade?: number
  status: BookStatus
}
