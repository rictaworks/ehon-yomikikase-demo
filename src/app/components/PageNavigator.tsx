import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { getStrings } from "@/lib/config/strings"

const strings = getStrings()

type Props = {
  bookId: number
  currentPage: number
  totalPages: number
}

export default function PageNavigator({
  bookId,
  currentPage,
  totalPages,
}: Props) {
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav
      aria-label="page navigation"
      className="flex items-center justify-between gap-4"
    >
      {hasPrev ? (
        <Link
          href={`/books/${bookId}/read?page=${currentPage - 1}`}
          className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-indigo-50 text-gray-700 font-bold px-5 py-3 rounded-xl text-lg transition-colors duration-150"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          {strings.readPage.prevButton}
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex items-center gap-2 bg-gray-100 text-gray-400 font-bold px-5 py-3 rounded-xl text-lg cursor-not-allowed select-none"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          {strings.readPage.prevButton}
        </span>
      )}

      <span className="text-gray-600 font-semibold text-base">
        {strings.readPage.pageIndicator
          .replace("{current}", String(currentPage))
          .replace("{total}", String(totalPages))}
      </span>

      {hasNext ? (
        <Link
          href={`/books/${bookId}/read?page=${currentPage + 1}`}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl text-lg transition-colors duration-150"
        >
          {strings.readPage.nextButton}
          <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex items-center gap-2 bg-gray-100 text-gray-400 font-bold px-5 py-3 rounded-xl text-lg cursor-not-allowed select-none"
        >
          {strings.readPage.nextButton}
          <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
        </span>
      )}
    </nav>
  )
}
