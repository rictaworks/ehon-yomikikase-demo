import { NextRequest } from "next/server"
import { ensureDb } from "@/lib/db/init"
import { getBookById } from "@/lib/services/book.service"

type Params = { id: string }

export async function GET(
  _request: NextRequest,
  context: { params: Promise<Params> }
): Promise<Response> {
  try {
    ensureDb()
    const { id } = await context.params
    const bookId = parseInt(id, 10)

    if (isNaN(bookId)) {
      return Response.json({ error: "Invalid book id" }, { status: 400 })
    }

    const book = getBookById(bookId)
    return Response.json(book)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    const status = message.startsWith("Book not found") ? 404 : 500
    console.error("[GET /api/books/[id]]", err)
    return Response.json({ error: message }, { status })
  }
}
