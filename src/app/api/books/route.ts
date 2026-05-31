import { NextRequest } from "next/server"
import { ensureDb } from "@/lib/db/init"
import { getAllBooks } from "@/lib/services/book.service"

export async function GET(request: NextRequest): Promise<Response> {
  try {
    ensureDb()

    const { searchParams } = request.nextUrl
    const categoryIdStr = searchParams.get("categoryId")
    const ageMinStr = searchParams.get("ageMin")
    const ageMaxStr = searchParams.get("ageMax")

    const filter: { categoryId?: number; ageMin?: number; ageMax?: number } =
      {}

    if (categoryIdStr !== null) {
      const parsed = parseInt(categoryIdStr, 10)
      if (isNaN(parsed)) {
        return Response.json({ error: "Invalid categoryId" }, { status: 400 })
      }
      filter.categoryId = parsed
    }
    if (ageMinStr !== null) {
      const parsed = parseInt(ageMinStr, 10)
      if (isNaN(parsed)) {
        return Response.json({ error: "Invalid ageMin" }, { status: 400 })
      }
      filter.ageMin = parsed
    }
    if (ageMaxStr !== null) {
      const parsed = parseInt(ageMaxStr, 10)
      if (isNaN(parsed)) {
        return Response.json({ error: "Invalid ageMax" }, { status: 400 })
      }
      filter.ageMax = parsed
    }

    const books = getAllBooks(filter)
    return Response.json(books)
  } catch (err) {
    console.error("[GET /api/books]", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
