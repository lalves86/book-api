type BookStatus = 'Wanna read' | 'Reading' | 'Read'

export type Book = {
  id: string
  title: string
  author: string
  createdAt: Date
  finishedAt?: Date
  grade?: number
  status: BookStatus
  userId: string
  imageUrl?: string
}
