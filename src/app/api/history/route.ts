import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ensureDb } from "@/lib/db/init"
import { add, getRecent } from "@/lib/services/history.service"
import { getOrCreate } from "@/lib/services/session.service"
import { validate } from "@/lib/validators/honeypot"
import { COOKIE_SESSION_ID, COOKIE_MAX_AGE } from "@/lib/config/strings"

async function getSessionFromCookie(): Promise<{ sessionId: string; isNew: boolean }> {
  const cookieStore = await cookies()
  const existing = cookieStore.get(COOKIE_SESSION_ID)?.value
  const sessionId = getOrCreate(existing)
  return { sessionId, isNew: sessionId !== existing }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    ensureDb()
    const { sessionId, isNew } = await getSessionFromCookie()

    const books = getRecent(sessionId)
    const res = NextResponse.json(books)

    if (isNew) {
      res.cookies.set(COOKIE_SESSION_ID, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      })
    }

    return res
  } catch (err) {
    console.error("[GET /api/history]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    ensureDb()
    const { sessionId, isNew } = await getSessionFromCookie()

    const body: Record<string, unknown> = await request.json()

    if (!validate(body)) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 })
    }

    const { bookId } = body

    if (typeof bookId !== "number") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    add(sessionId, bookId)
    const res = NextResponse.json({ ok: true })

    if (isNew) {
      res.cookies.set(COOKIE_SESSION_ID, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      })
    }

    return res
  } catch (err) {
    console.error("[POST /api/history]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
