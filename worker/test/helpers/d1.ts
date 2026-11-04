import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";

const MIGRATIONS_DIR = fileURLToPath(new URL("../../../migrations", import.meta.url));

/**
 * テスト用の D1 互換アダプタ（node:sqlite 上）。
 * migrations/ の SQL をそのまま適用するため、本番と同じスキーマ・マスタで検査できる。
 */
class LocalStatement {
  private values: SQLInputValue[] = [];

  constructor(
    private readonly db: DatabaseSync,
    private readonly sql: string
  ) {}

  bind(...values: SQLInputValue[]): LocalStatement {
    this.values = values;
    return this;
  }

  async all<T>(): Promise<{ results: T[]; success: boolean }> {
    const results = this.db.prepare(this.sql).all(...this.values) as T[];
    return { results, success: true };
  }

  async first<T>(): Promise<T | null> {
    const row = this.db.prepare(this.sql).get(...this.values) as T | undefined;
    return row ?? null;
  }

  async run(): Promise<{ success: boolean }> {
    this.db.prepare(this.sql).run(...this.values);
    return { success: true };
  }
}

export function createTestD1(): D1Database {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  for (const file of files) {
    db.exec(readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8"));
  }

  const adapter = {
    prepare(sql: string): LocalStatement {
      return new LocalStatement(db, sql);
    },
    async batch(statements: LocalStatement[]): Promise<{ success: boolean }[]> {
      db.exec("BEGIN");
      try {
        const results: { success: boolean }[] = [];
        for (const statement of statements) {
          results.push(await statement.run());
        }
        db.exec("COMMIT");
        return results;
      } catch (err) {
        db.exec("ROLLBACK");
        throw err;
      }
    }
  };

  return adapter as unknown as D1Database;
}
