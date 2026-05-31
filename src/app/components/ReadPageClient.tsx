"use client"

import { useEffect, useRef } from "react"
import SpeechPlayer from "./SpeechPlayer"
import PageNavigator from "./PageNavigator"
import { Page } from "@/lib/types"

type Props = {
  page: Page
  bookId: number
  totalPages: number
  initialSessionId: string | null
}

async function resolveSessionId(initialSessionId: string | null): Promise<string> {
  if (initialSessionId) {
    return initialSessionId
  }
  const res = await fetch("/api/session")
  if (!res.ok) {
    throw new Error(`session fetch failed: ${res.status}`)
  }
  const data = (await res.json()) as { sessionId: string }
  return data.sessionId
}

export default function ReadPageClient({
  page,
  bookId,
  totalPages,
  initialSessionId,
}: Props) {
  const sessionIdRef = useRef<string | null>(initialSessionId)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    const saveProgress = async () => {
      try {
        const sessionId = await resolveSessionId(sessionIdRef.current)
        sessionIdRef.current = sessionId
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            bookId,
            lastPage: page.pageNumber,
            hp_email: "",
          }),
        })
      } catch (err) {
        console.error("[ReadPageClient] progress save failed:", err)
      }
    }

    const saveHistory = async () => {
      try {
        const sessionId = await resolveSessionId(sessionIdRef.current)
        sessionIdRef.current = sessionId
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            bookId,
            hp_email: "",
          }),
        })
      } catch (err) {
        console.error("[ReadPageClient] history save failed:", err)
      }
    }

    void saveProgress()

    if (page.pageNumber === 1) {
      void saveHistory()
    }
  }, [page.pageNumber, bookId])

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-amber-50 rounded-2xl overflow-hidden border border-amber-100 flex items-center justify-center min-h-64">
        <img
          src={page.imagePath}
          alt={`ページ ${page.pageNumber}`}
          className="max-w-full max-h-96 object-contain"
        />
      </div>

      <div className="bg-white rounded-2xl shadow px-6 py-5 border border-gray-100">
        <p className="text-2xl font-bold text-gray-800 leading-relaxed">
          {page.textContent}
        </p>
      </div>

      <SpeechPlayer text={page.textContent} />

      <PageNavigator
        bookId={bookId}
        currentPage={page.pageNumber}
        totalPages={totalPages}
      />
    </div>
  )
}
