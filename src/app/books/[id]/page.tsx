import Link from "next/link"
import { notFound } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faChildReaching,
  faTag,
  faBookOpen,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons"
import { ensureDb } from "@/lib/db/init"
import { getBookById } from "@/lib/services/book.service"
import { get as getProgress } from "@/lib/services/progress.service"
import { readSessionId } from "@/lib/session-cookie"
import { getStrings } from "@/lib/config/strings"

const strings = getStrings()

type Params = { id: string }

type Props = {
  params: Promise<Params>
}

export default async function BookDetailPage({ params }: Props) {
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

  const sessionId = await readSessionId()
  const lastPage = sessionId ? getProgress(sessionId, bookId) : null

  const ageRange = strings.bookDetail.ageRange
    .replace("{min}", String(book.ageMin))
    .replace("{max}", String(book.ageMax))

  const readLabel =
    lastPage && lastPage > 1
      ? strings.bookDetail.continueButton.replace("{page}", String(lastPage))
      : strings.bookDetail.readButton

  const readHref =
    lastPage && lastPage > 1
      ? `/books/${bookId}/read?page=${lastPage}`
      : `/books/${bookId}/read?page=1`

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold mb-6 text-base transition-colors duration-150"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        {strings.bookDetail.backButton}
      </Link>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-amber-50 h-72 flex items-center justify-center overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="p-8 flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">
            {book.title}
          </h1>

          <dl className="flex flex-col gap-3 text-base text-gray-600">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <dt className="sr-only">{strings.bookDetail.author}</dt>
              <dd>
                {strings.bookDetail.author}
                <span className="font-semibold">{book.author}</span>
              </dd>
            </div>

            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faChildReaching} className="w-5 h-5 text-green-400 flex-shrink-0" />
              <dt className="sr-only">{strings.bookDetail.ageRange}</dt>
              <dd>{ageRange}</dd>
            </div>

            {book.categoryName && (
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faTag} className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <dt className="sr-only">{strings.bookDetail.category}</dt>
                <dd>
                  <span className="inline-block bg-pink-100 text-pink-700 rounded-full px-3 py-0.5 text-sm font-semibold">
                    {book.categoryName}
                  </span>
                </dd>
              </div>
            )}

            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <dt className="sr-only">{strings.bookDetail.totalPages}</dt>
              <dd>
                {strings.bookDetail.totalPages.replace(
                  "{total}",
                  String(book.totalPages)
                )}
              </dd>
            </div>
          </dl>

          <Link
            href={readHref}
            className="flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold py-4 rounded-xl text-xl transition-colors duration-150 mt-2"
          >
            <FontAwesomeIcon icon={faBookOpen} className="w-6 h-6" />
            {readLabel}
          </Link>
        </div>
      </div>
    </main>
  )
}
