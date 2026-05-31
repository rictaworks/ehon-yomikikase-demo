import Database from "better-sqlite3"
import path from "path"

if (typeof window !== "undefined") {
  throw new Error("lib/db must only be imported on the server side")
}

const DB_PATH = process.env.DB_PATH ?? path.join("/tmp", "ehon.db")

let instance: Database.Database | null = null

export function getDb(): Database.Database {
  if (instance) {
    return instance
  }
  instance = new Database(DB_PATH)
  instance.pragma("journal_mode = WAL")
  instance.pragma("foreign_keys = ON")
  return instance
}
