import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ensureDb } from "@/lib/db/init"
import { getOrCreate, touch } from "@/lib/services/session.service"
import { COOKIE_SESSION_ID, COOKIE_MAX_AGE } from "@/lib/config/strings"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    ensureDb()
    const cookieStore = await cookies()
    const existing = cookieStore.get(COOKIE_SESSION_ID)?.value
    const sessionId = getOrCreate(existing)

    const res = NextResponse.json({ sessionId })

    if (sessionId !== existing) {
      res.cookies.set(COOKIE_SESSION_ID, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      })
    } else {
      touch(sessionId)
    }

    return res
  } catch (err) {
    console.error("[GET /api/session]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
