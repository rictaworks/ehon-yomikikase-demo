"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import LoadingIndicator from "@/components/LoadingIndicator"
import NotFoundMessage from "@/components/NotFoundMessage"
import ReadPageClient from "@/components/ReadPageClient"
import { useApiData } from "@/lib/useApiData"
import type { Book, Page } from "@/lib/types"
import { getStrings } from "@/config/strings"

const strings = getStrings()

const INTEGER_PATTERN = /^\d+$/

type Props = {
  bookId: number
}

export default function ReadView({ bookId }: Props) {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page") ?? "1"
  const pageNumber = INTEGER_PATTERN.test(pageParam) ? Number(pageParam) : 0
  const validPage = pageNumber >= 1

  const book = useApiData<Book>(`/api/books/${bookId}`)
  const page = useApiData<Page>(validPage ? `/api/books/${bookId}/pages?page=${pageNumber}` : null)

  if (!validPage) {
    return <NotFoundMessage />
  }
  if (book.state === "loading" || page.state === "loading") {
    return <LoadingIndicator />
  }
  if (book.state === "error" || page.state === "error") {
    if (book.state === "error" && book.status === 404) {
      return <NotFoundMessage />
    }
    if (page.state === "error" && page.status === 404) {
      return <NotFoundMessage />
    }
    return (
      <p role="alert" className="text-center text-red-600 text-xl py-20">
        {strings.error.loadFailed}
      </p>
    )
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/books/${bookId}`}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-base transition-colors duration-150"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          {strings.readPage.backButton}
        </Link>

        <h1 className="text-lg font-bold text-gray-700 truncate max-w-xs">{book.data.title}</h1>
      </div>

      <ReadPageClient page={page.data} bookId={bookId} totalPages={book.data.totalPages} />
    </main>
  )
}
