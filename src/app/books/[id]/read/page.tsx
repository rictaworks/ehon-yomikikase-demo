import Link from "next/link"
import { notFound } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { ensureDb } from "@/lib/db/init"
import { getBookById, getPage } from "@/lib/services/book.service"
import { readSessionId } from "@/lib/session-cookie"
import ReadPageClient from "@/app/components/ReadPageClient"
import { getStrings } from "@/lib/config/strings"

const strings = getStrings()

type Params = { id: string }
type SearchParams = { page?: string }

type Props = {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}

export default async function ReadPage({ params, searchParams }: Props) {
  ensureDb()

  const { id } = await params
  const bookId = parseInt(id, 10)
  if (isNaN(bookId)) {
    notFound()
  }

  let book
  try {
    book = getBookById(bookId)
  } catch {
    notFound()
  }

  const sp = await searchParams
  const pageNumber = parseInt(sp.page ?? "1", 10)
  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > book.totalPages) {
    notFound()
  }

  let page
  try {
    page = getPage(bookId, pageNumber)
  } catch {
    notFound()
  }

  const sessionId = await readSessionId()

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

        <h1 className="text-lg font-bold text-gray-700 truncate max-w-xs">
          {book.title}
        </h1>
      </div>

      <ReadPageClient
        page={page}
        bookId={bookId}
        totalPages={book.totalPages}
        initialSessionId={sessionId}
      />
    </main>
  )
}
