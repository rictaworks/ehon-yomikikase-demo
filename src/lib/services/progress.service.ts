import { getDb } from "../db"

type ProgressRow = {
  last_page: number
}

export function save(
  sessionId: string,
  bookId: number,
  lastPage: number
): void {
  const db = getDb()
  const now = new Date().toISOString()

  db.prepare(
    `INSERT INTO reading_progress (session_id, book_id, last_page, updated_at, is_master)
     VALUES (?, ?, ?, ?, 0)
     ON CONFLICT(session_id, book_id) DO UPDATE SET last_page = excluded.last_page, updated_at = excluded.updated_at`
  ).run(sessionId, bookId, lastPage, now)
}

export function get(
  sessionId: string,
  bookId: number
): number | null {
  const db = getDb()
  const row = db
    .prepare(
      "SELECT last_page FROM reading_progress WHERE session_id = ? AND book_id = ?"
    )
    .get(sessionId, bookId) as ProgressRow | undefined

  return row ? row.last_page : null
}
