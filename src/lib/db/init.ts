import { initSchema } from "./schema"
import { seed } from "./seed"

let initialized = false

export function ensureDb(): void {
  if (initialized) {
    return
  }
  initSchema()
  seed()
  initialized = true
}
