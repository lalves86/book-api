type BookStatus = 'Wanna read' | 'Reading' | 'Read'

export type Book = {
  title: string;
  author: string;
  createdAt: Date;
  finishedAt: Date;
  grade: number;
  status: BookStatus;
}
