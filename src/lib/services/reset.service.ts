import { getDb } from "../db"
import { seed } from "../db/seed"

export function reset(): void {
  const db = getDb()

  db.transaction(() => {
    db.prepare("DELETE FROM reading_history WHERE is_master = 0").run()
    db.prepare("DELETE FROM reading_progress WHERE is_master = 0").run()
    db.prepare("DELETE FROM sessions WHERE is_master = 0").run()
    db.prepare("DELETE FROM pages WHERE is_master = 0").run()
    db.prepare("DELETE FROM books WHERE is_master = 0").run()
    db.prepare("DELETE FROM category_keywords WHERE is_master = 0").run()
    db.prepare("DELETE FROM categories WHERE is_master = 0").run()
  })()

  seed()
}
