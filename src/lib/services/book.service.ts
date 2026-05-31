import { getDb } from "../db"
import { Book, Page } from "../types"

type BookRow = {
  id: number
  title: string
  author: string
  cover_image: string
  age_min: number
  age_max: number
  category_id: number
  total_pages: number
  category_name: string | null
}

type PageRow = {
  id: number
  book_id: number
  page_number: number
  image_path: string
  text_content: string
}

function toBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    coverImage: row.cover_image,
    ageMin: row.age_min,
    ageMax: row.age_max,
    categoryId: row.category_id,
    totalPages: row.total_pages,
    categoryName: row.category_name ?? undefined,
  }
}

function toPage(row: PageRow): Page {
  return {
    id: row.id,
    bookId: row.book_id,
    pageNumber: row.page_number,
    imagePath: row.image_path,
    textContent: row.text_content,
  }
}

export type BookFilter = {
  categoryId?: number
  ageMin?: number
  ageMax?: number
}

export function getAllBooks(filter?: BookFilter): Book[] {
  const db = getDb()

  const conditions: string[] = []
  const params: (number | string)[] = []

  if (filter?.categoryId !== undefined) {
    conditions.push("b.category_id = ?")
    params.push(filter.categoryId)
  }
  if (filter?.ageMin !== undefined) {
    conditions.push("b.age_max >= ?")
    params.push(filter.ageMin)
  }
  if (filter?.ageMax !== undefined) {
    conditions.push("b.age_min <= ?")
    params.push(filter.ageMax)
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

  const rows = db
    .prepare(
      `SELECT b.*, c.name as category_name
       FROM books b
       LEFT JOIN categories c ON c.id = b.category_id
       ${where}
       ORDER BY b.id`
    )
    .all(...params) as BookRow[]

  return rows.map(toBook)
}

export function getBookById(id: number): Book {
  const db = getDb()
  const row = db
    .prepare(
      `SELECT b.*, c.name as category_name
       FROM books b
       LEFT JOIN categories c ON c.id = b.category_id
       WHERE b.id = ?`
    )
    .get(id) as BookRow | undefined

  if (!row) {
    throw new Error(`Book not found: ${id}`)
  }
  return toBook(row)
}

export function getPages(bookId: number): Page[] {
  const db = getDb()
  const rows = db
    .prepare(
      "SELECT * FROM pages WHERE book_id = ? ORDER BY page_number"
    )
    .all(bookId) as PageRow[]
  return rows.map(toPage)
}

export function getPage(bookId: number, pageNumber: number): Page {
  const db = getDb()
  const row = db
    .prepare(
      "SELECT * FROM pages WHERE book_id = ? AND page_number = ?"
    )
    .get(bookId, pageNumber) as PageRow | undefined

  if (!row) {
    throw new Error(`Page not found: book=${bookId} page=${pageNumber}`)
  }
  return toPage(row)
}
