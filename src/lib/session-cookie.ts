import { cookies } from "next/headers"
import { COOKIE_SESSION_ID } from "./config/strings"

// Server Component safe: read-only. Writing cookies requires a Route Handler or Server Action.
export async function readSessionId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_SESSION_ID)?.value ?? null
}
