import { NextRequest } from "next/server"
import { ensureDb } from "@/lib/db/init"
import { reset } from "@/lib/services/reset.service"
import { ADMIN_INTERNAL_KEY_HEADER } from "@/lib/config/strings"

export async function POST(request: NextRequest): Promise<Response> {
  try {
    ensureDb()
    const authHeader = request.headers.get(ADMIN_INTERNAL_KEY_HEADER)
    const expectedKey = process.env.ADMIN_INTERNAL_KEY

    if (!expectedKey) {
      return Response.json(
        { error: "Admin key not configured" },
        { status: 503 }
      )
    }

    if (authHeader !== `Bearer ${expectedKey}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    reset()
    return Response.json({ ok: true })
  } catch (err) {
    console.error("[POST /api/admin/reset]", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
