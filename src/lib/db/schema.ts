import { getDb } from "./index"

export function initSchema(): void {
  const db = getDb()

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority INTEGER NOT NULL DEFAULT 0,
      is_master INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS category_keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      keyword TEXT NOT NULL,
      is_master INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      age_min INTEGER NOT NULL,
      age_max INTEGER NOT NULL,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      total_pages INTEGER NOT NULL,
      is_master INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL REFERENCES books(id),
      page_number INTEGER NOT NULL,
      image_path TEXT NOT NULL,
      text_content TEXT NOT NULL,
      is_master INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL,
      is_master INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reading_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL REFERENCES sessions(id),
      book_id INTEGER NOT NULL REFERENCES books(id),
      last_page INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      is_master INTEGER NOT NULL DEFAULT 0,
      UNIQUE(session_id, book_id)
    );

    CREATE TABLE IF NOT EXISTS reading_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL REFERENCES sessions(id),
      book_id INTEGER NOT NULL REFERENCES books(id),
      viewed_at TEXT NOT NULL,
      is_master INTEGER NOT NULL DEFAULT 0
    );
  `)
}
