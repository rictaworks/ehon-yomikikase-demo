import { NextRequest } from "next/server"
import { ensureDb } from "@/lib/db/init"
import { getPages, getPage } from "@/lib/services/book.service"

type Params = { id: string }

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
): Promise<Response> {
  try {
    ensureDb()
    const { id } = await context.params
    const bookId = parseInt(id, 10)

    if (isNaN(bookId)) {
      return Response.json({ error: "Invalid book id" }, { status: 400 })
    }

    const pageStr = request.nextUrl.searchParams.get("page")

    if (pageStr !== null) {
      const pageNumber = parseInt(pageStr, 10)
      if (isNaN(pageNumber)) {
        return Response.json({ error: "Invalid page number" }, { status: 400 })
      }
      const page = getPage(bookId, pageNumber)
      return Response.json(page)
    }

    const pages = getPages(bookId)
    return Response.json(pages)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    const status = message.startsWith("Page not found") ? 404 : 500
    console.error("[GET /api/books/[id]/pages]", err)
    return Response.json({ error: message }, { status })
  }
}
