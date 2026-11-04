"use client"

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHistory, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import BookCard from "@/components/BookCard"
import LoadingIndicator from "@/components/LoadingIndicator"
import { useApiData } from "@/lib/useApiData"
import type { Book } from "@/lib/types"
import { getStrings } from "@/config/strings"

const strings = getStrings()

export default function HistoryView() {
  const books = useApiData<Book[]>("/api/history")

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faHistory} className="w-8 h-8 text-indigo-500" />
        {strings.history.heading}
      </h1>

      {books.state === "loading" ? <LoadingIndicator /> : null}

      {books.state === "error" ? (
        <p role="alert" className="text-center text-red-600 text-xl py-20">
          {strings.error.loadFailed}
        </p>
      ) : null}

      {books.state === "ready" && books.data.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-20">
          <p className="text-center text-gray-500 text-xl">{strings.history.empty}</p>
          <Link
            href="/"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-base transition-colors duration-150"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            {strings.history.backButton}
          </Link>
        </div>
      ) : null}

      {books.state === "ready" && books.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.data.map((book, idx) => (
            <BookCard key={`${book.id}-${idx}`} book={book} />
          ))}
        </div>
      ) : null}
    </main>
  )
}
