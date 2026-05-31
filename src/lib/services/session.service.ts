import { v4 as uuidv4 } from "uuid"
import { getDb } from "../db"

type SessionRow = {
  id: string
}

export function getOrCreate(sessionId?: string): string {
  const db = getDb()
  const now = new Date().toISOString()

  if (sessionId) {
    const existing = db
      .prepare("SELECT id FROM sessions WHERE id = ?")
      .get(sessionId) as SessionRow | undefined

    if (existing) {
      return existing.id
    }
  }

  const newId = uuidv4()
  db.prepare(
    "INSERT INTO sessions (id, created_at, last_seen_at, is_master) VALUES (?, ?, ?, 0)"
  ).run(newId, now, now)

  return newId
}

export function touch(sessionId: string): void {
  const db = getDb()
  const now = new Date().toISOString()
  db.prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?").run(
    now,
    sessionId
  )
}
