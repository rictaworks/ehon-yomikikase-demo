// Worker API（worker/src/types.ts）の JSON 形と一致させる。

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

export type ProgressResponse = {
  lastPage: number | null
}
