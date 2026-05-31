import { getDb } from "../db"
import { Book } from "../types"
import { HISTORY_DEFAULT_LIMIT } from "../config/strings"

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

export function add(sessionId: string, bookId: number): void {
  const db = getDb()
  const now = new Date().toISOString()
  db.prepare(
    "INSERT INTO reading_history (session_id, book_id, viewed_at, is_master) VALUES (?, ?, ?, 0)"
  ).run(sessionId, bookId, now)
}

export function getRecent(
  sessionId: string,
  limit: number = HISTORY_DEFAULT_LIMIT
): Book[] {
  const db = getDb()
  const rows = db
    .prepare(
      `SELECT b.*, c.name as category_name
       FROM reading_history h
       JOIN books b ON b.id = h.book_id
       LEFT JOIN categories c ON c.id = b.category_id
       WHERE h.session_id = ?
       ORDER BY h.viewed_at DESC
       LIMIT ?`
    )
    .all(sessionId, limit) as BookRow[]

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    author: r.author,
    coverImage: r.cover_image,
    ageMin: r.age_min,
    ageMax: r.age_max,
    categoryId: r.category_id,
    totalPages: r.total_pages,
    categoryName: r.category_name ?? undefined,
  }))
}
