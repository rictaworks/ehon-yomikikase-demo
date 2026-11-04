"use client"

import { useSearchParams } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook } from "@fortawesome/free-solid-svg-icons"
import BookCard from "@/components/BookCard"
import FilterBar from "@/components/FilterBar"
import LoadingIndicator from "@/components/LoadingIndicator"
import { useApiData } from "@/lib/useApiData"
import type { Book, Category } from "@/lib/types"
import { getStrings } from "@/config/strings"

const strings = getStrings()

const FILTER_KEYS = ["categoryId", "ageMin", "ageMax"] as const
const INTEGER_PATTERN = /^\d+$/

/** URL の絞り込み条件のうち数値のものだけを API のクエリに載せる（旧ページと同じ扱い）。 */
function buildBooksPath(searchParams: URLSearchParams): string {
  const query = new URLSearchParams()
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key)
    if (value !== null && INTEGER_PATTERN.test(value)) {
      query.set(key, value)
    }
  }
  const qs = query.toString()
  return qs ? `/api/books?${qs}` : "/api/books"
}

export default function HomeView() {
  const searchParams = useSearchParams()
  const categories = useApiData<Category[]>("/api/categories")
  const books = useApiData<Book[]>(buildBooksPath(searchParams))

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faBook} className="w-8 h-8 text-indigo-500" />
        {strings.home.heading}
      </h1>

      <div className="mb-8">
        {categories.state === "ready" ? <FilterBar categories={categories.data} /> : null}
      </div>

      {books.state === "loading" ? <LoadingIndicator /> : null}

      {books.state === "error" ? (
        <p role="alert" className="text-center text-red-600 text-xl py-20">
          {strings.error.loadFailed}
        </p>
      ) : null}

      {books.state === "ready" && books.data.length === 0 ? (
        <p className="text-center text-gray-500 text-xl py-20">{strings.home.noBooks}</p>
      ) : null}

      {books.state === "ready" && books.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.data.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : null}
    </main>
  )
}
