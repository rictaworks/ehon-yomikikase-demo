import type { Book, BookFilter, Category, Page } from "../types";

interface BookRow {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  age_min: number;
  age_max: number;
  category_id: number;
  total_pages: number;
  category_name: string | null;
}

interface PageRow {
  id: number;
  book_id: number;
  page_number: number;
  image_path: string;
  text_content: string;
}

interface CategoryRow {
  id: number;
  name: string;
  priority: number;
}

interface ProgressRow {
  last_page: number;
}

interface SessionRow {
  id: string;
}

const BOOK_SELECT = `SELECT b.id, b.title, b.author, b.cover_image, b.age_min, b.age_max,
       b.category_id, b.total_pages, c.name AS category_name
FROM books b
LEFT JOIN categories c ON c.id = b.category_id`;

/** 日次リセットで消す利用者データ。依存の深い順（履歴・進捗 → セッション → 絵本・ページ → カテゴリ）。 */
const RESET_STATEMENTS = [
  "DELETE FROM reading_history WHERE is_master = 0",
  "DELETE FROM reading_progress WHERE is_master = 0",
  "DELETE FROM sessions WHERE is_master = 0",
  "DELETE FROM pages WHERE is_master = 0",
  "DELETE FROM books WHERE is_master = 0",
  "DELETE FROM category_keywords WHERE is_master = 0",
  "DELETE FROM categories WHERE is_master = 0"
];

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
    categoryName: row.category_name ?? undefined
  };
}

function toPage(row: PageRow): Page {
  return {
    id: row.id,
    bookId: row.book_id,
    pageNumber: row.page_number,
    imagePath: row.image_path,
    textContent: row.text_content
  };
}

function toCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, priority: row.priority };
}

export class DemoRepository {
  constructor(private readonly db: D1Database) {}

  async listCategories(): Promise<Category[]> {
    const { results } = await this.db
      .prepare("SELECT id, name, priority FROM categories ORDER BY priority")
      .all<CategoryRow>();
    return results.map(toCategory);
  }

  async listBooks(filter: BookFilter): Promise<Book[]> {
    const conditions: string[] = [];
    const params: number[] = [];

    if (filter.categoryId !== undefined) {
      conditions.push("b.category_id = ?");
      params.push(filter.categoryId);
    }
    if (filter.ageMin !== undefined) {
      conditions.push("b.age_max >= ?");
      params.push(filter.ageMin);
    }
    if (filter.ageMax !== undefined) {
      conditions.push("b.age_min <= ?");
      params.push(filter.ageMax);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const { results } = await this.db
      .prepare(`${BOOK_SELECT} ${where} ORDER BY b.id`)
      .bind(...params)
      .all<BookRow>();
    return results.map(toBook);
  }

  async findBook(bookId: number): Promise<Book | null> {
    const row = await this.db
      .prepare(`${BOOK_SELECT} WHERE b.id = ?`)
      .bind(bookId)
      .first<BookRow>();
    return row ? toBook(row) : null;
  }

  async listPages(bookId: number): Promise<Page[]> {
    const { results } = await this.db
      .prepare(
        "SELECT id, book_id, page_number, image_path, text_content FROM pages WHERE book_id = ? ORDER BY page_number"
      )
      .bind(bookId)
      .all<PageRow>();
    return results.map(toPage);
  }

  async findPage(bookId: number, pageNumber: number): Promise<Page | null> {
    const row = await this.db
      .prepare(
        "SELECT id, book_id, page_number, image_path, text_content FROM pages WHERE book_id = ? AND page_number = ?"
      )
      .bind(bookId, pageNumber)
      .first<PageRow>();
    return row ? toPage(row) : null;
  }

  async findSession(sessionId: string): Promise<boolean> {
    const row = await this.db
      .prepare("SELECT id FROM sessions WHERE id = ?")
      .bind(sessionId)
      .first<SessionRow>();
    return row !== null;
  }

  /** 利用者セッションの件数（マスタ以外）。件数上限の判定に使う。 */
  async countSessions(): Promise<number> {
    const row = await this.db
      .prepare("SELECT COUNT(*) AS n FROM sessions WHERE is_master = 0")
      .first<{ n: number }>();
    return row?.n ?? 0;
  }

  async countHistory(sessionId: string): Promise<number> {
    const row = await this.db
      .prepare("SELECT COUNT(*) AS n FROM reading_history WHERE session_id = ?")
      .bind(sessionId)
      .first<{ n: number }>();
    return row?.n ?? 0;
  }

  async createSession(sessionId: string, nowIso: string): Promise<void> {
    await this.db
      .prepare("INSERT INTO sessions (id, created_at, last_seen_at, is_master) VALUES (?, ?, ?, 0)")
      .bind(sessionId, nowIso, nowIso)
      .run();
  }

  async touchSession(sessionId: string, nowIso: string): Promise<void> {
    await this.db
      .prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?")
      .bind(nowIso, sessionId)
      .run();
  }

  async findProgress(sessionId: string, bookId: number): Promise<number | null> {
    const row = await this.db
      .prepare("SELECT last_page FROM reading_progress WHERE session_id = ? AND book_id = ?")
      .bind(sessionId, bookId)
      .first<ProgressRow>();
    return row ? row.last_page : null;
  }

  async saveProgress(sessionId: string, bookId: number, lastPage: number, nowIso: string): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO reading_progress (session_id, book_id, last_page, updated_at, is_master)
         VALUES (?, ?, ?, ?, 0)
         ON CONFLICT(session_id, book_id) DO UPDATE SET last_page = excluded.last_page, updated_at = excluded.updated_at`
      )
      .bind(sessionId, bookId, lastPage, nowIso)
      .run();
  }

  async addHistory(sessionId: string, bookId: number, nowIso: string): Promise<void> {
    await this.db
      .prepare("INSERT INTO reading_history (session_id, book_id, viewed_at, is_master) VALUES (?, ?, ?, 0)")
      .bind(sessionId, bookId, nowIso)
      .run();
  }

  async listRecentBooks(sessionId: string, limit: number): Promise<Book[]> {
    const { results } = await this.db
      .prepare(
        `${BOOK_SELECT}
         JOIN reading_history h ON h.book_id = b.id
         WHERE h.session_id = ?
         ORDER BY h.viewed_at DESC, h.id DESC
         LIMIT ?`
      )
      .bind(sessionId, limit)
      .all<BookRow>();
    return results.map(toBook);
  }

  /** 日次リセット：マスタ（is_master = 1）以外を 1 トランザクションで削除する。 */
  async purgeDemoData(): Promise<void> {
    await this.db.batch(RESET_STATEMENTS.map((sql) => this.db.prepare(sql)));
  }
}
