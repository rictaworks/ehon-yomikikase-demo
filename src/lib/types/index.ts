export type Book = {
  id: number
  title: string
  author: string
  coverImage: string
  ageMin: number
  ageMax: number
  categoryId: number
  totalPages: number
  categoryName?: string
}

export type Page = {
  id: number
  bookId: number
  pageNumber: number
  imagePath: string
  textContent: string
}

export type Category = {
  id: number
  name: string
  priority: number
}

export type Session = {
  id: string
  createdAt: string
  lastSeenAt: string
}

export type ReadingProgress = {
  id: number
  sessionId: string
  bookId: number
  lastPage: number
  updatedAt: string
}

export type ReadingHistory = {
  id: number
  sessionId: string
  bookId: number
  viewedAt: string
}
