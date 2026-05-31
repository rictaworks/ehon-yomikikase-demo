import { NextRequest } from "next/server"
import { ensureDb } from "@/lib/db/init"
import { add, getRecent } from "@/lib/services/history.service"
import { validate } from "@/lib/validators/honeypot"

export async function GET(request: NextRequest): Promise<Response> {
  try {
    ensureDb()
    const sessionId = request.nextUrl.searchParams.get("sessionId")

    if (!sessionId) {
      return Response.json({ error: "sessionId is required" }, { status: 400 })
    }

    const books = getRecent(sessionId)
    return Response.json(books)
  } catch (err) {
    console.error("[GET /api/history]", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    ensureDb()
    const body: Record<string, unknown> = await request.json()

    if (!validate(body)) {
      return Response.json({ error: "Bad request" }, { status: 400 })
    }

    const { sessionId, bookId } = body

    if (typeof sessionId !== "string" || typeof bookId !== "number") {
      return Response.json({ error: "Invalid request body" }, { status: 400 })
    }

    add(sessionId, bookId)
    return Response.json({ ok: true })
  } catch (err) {
    console.error("[POST /api/history]", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
