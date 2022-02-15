type BookStatus = 'Wanna read' | 'Reading' | 'Read'

export class CreateBookDto {
  title: string
  author: string
  createdAt: Date
  finishedAt?: Date
  grade?: number
  status: BookStatus
}
