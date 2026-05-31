import { getDb } from "../db"
import { Category } from "../types"

type CategoryRow = {
  id: number
  name: string
  priority: number
}

type KeywordRow = {
  category_id: number
  keyword: string
}

export function getAll(): Category[] {
  const db = getDb()
  const rows = db
    .prepare("SELECT id, name, priority FROM categories ORDER BY priority")
    .all() as CategoryRow[]
  return rows.map((r) => ({ id: r.id, name: r.name, priority: r.priority }))
}

export function classify(title: string, text: string): number {
  const db = getDb()
  const keywords = db
    .prepare("SELECT category_id, keyword FROM category_keywords")
    .all() as KeywordRow[]

  const combined = `${title} ${text}`.toLowerCase()

  const scores = new Map<number, number>()
  for (const { category_id, keyword } of keywords) {
    if (combined.includes(keyword)) {
      scores.set(category_id, (scores.get(category_id) ?? 0) + 1)
    }
  }

  if (scores.size === 0) {
    const fallback = db
      .prepare(
        "SELECT id FROM categories ORDER BY priority DESC LIMIT 1"
      )
      .get() as CategoryRow | undefined
    if (!fallback) {
      throw new Error("No categories found in database")
    }
    return fallback.id
  }

  let bestId = 0
  let bestScore = -1
  for (const [id, score] of scores) {
    if (score > bestScore) {
      bestScore = score
      bestId = id
    }
  }
  return bestId
}
