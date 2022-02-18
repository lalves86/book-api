type BookStatus = 'Wanna read' | 'Reading' | 'Read'

export class UpdateBookDto {
  id: string
  title: string
  author: string
  finishedAt?: Date
  grade?: number
  status: BookStatus
}
