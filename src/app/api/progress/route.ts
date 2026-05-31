import { NextRequest } from "next/server"
import { ensureDb } from "@/lib/db/init"
import { get, save } from "@/lib/services/progress.service"
import { validate } from "@/lib/validators/honeypot"

export async function GET(request: NextRequest): Promise<Response> {
  try {
    ensureDb()
    const { searchParams } = request.nextUrl
    const sessionId = searchParams.get("sessionId")
    const bookIdStr = searchParams.get("bookId")

    if (!sessionId || !bookIdStr) {
      return Response.json(
        { error: "sessionId and bookId are required" },
        { status: 400 }
      )
    }

    const bookId = parseInt(bookIdStr, 10)
    if (isNaN(bookId)) {
      return Response.json({ error: "Invalid bookId" }, { status: 400 })
    }

    const lastPage = get(sessionId, bookId)
    return Response.json({ lastPage })
  } catch (err) {
    console.error("[GET /api/progress]", err)
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

    const { sessionId, bookId, lastPage } = body

    if (
      typeof sessionId !== "string" ||
      typeof bookId !== "number" ||
      typeof lastPage !== "number"
    ) {
      return Response.json({ error: "Invalid request body" }, { status: 400 })
    }

    save(sessionId, bookId, lastPage)
    return Response.json({ ok: true })
  } catch (err) {
    console.error("[POST /api/progress]", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
