type BookStatus = {
  reading: 'Reading',
  wannaRead: 'Wanna Read',
  read: 'Read',
}

export type Book = {
  title: string;
  author: string;
  createdAt: Date;
  finishedAt: Date;
  grade: number;
  status: BookStatus;
}
