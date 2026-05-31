"use client"

import { useEffect } from "react"
import SpeechPlayer from "./SpeechPlayer"
import PageNavigator from "./PageNavigator"
import { Page } from "@/lib/types"

type Props = {
  page: Page
  bookId: number
  totalPages: number
}

export default function ReadPageClient({ page, bookId, totalPages }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    const saveProgress = async () => {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
