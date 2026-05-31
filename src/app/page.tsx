import { Suspense } from "react"
import { ensureDb } from "@/lib/db/init"
import { getAllBooks } from "@/lib/services/book.service"
import { getAll as getAllCategories } from "@/lib/services/category.service"
import BookCard from "@/app/components/BookCard"
import FilterBar from "@/app/components/FilterBar"
import { getStrings } from "@/lib/config/strings"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook } from "@fortawesome/free-solid-svg-icons"

const strings = getStrings()

type SearchParams = {
  categoryId?: string
  ageMin?: string
  ageMax?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function HomePage({ searchParams }: Props) {
  ensureDb()

  const params = await searchParams

  const filter: { categoryId?: number; ageMin?: number; ageMax?: number } = {}
  if (params.categoryId) {
    const v = parseInt(params.categoryId, 10)
    if (!isNaN(v)) filter.categoryId = v
  }
  if (params.ageMin) {
    const v = parseInt(params.ageMin, 10)
    if (!isNaN(v)) filter.ageMin = v
  }
  if (params.ageMax) {
    const v = parseInt(params.ageMax, 10)
    if (!isNaN(v)) filter.ageMax = v
  }

  const books = getAllBooks(filter)
  const categories = getAllCategories()

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faBook} className="w-8 h-8 text-indigo-500" />
        {strings.home.heading}
      </h1>

      <div className="mb-8">
        <Suspense fallback={null}>
          <FilterBar categories={categories} />
        </Suspense>
      </div>

      {books.length === 0 ? (
        <p className="text-center text-gray-500 text-xl py-20">
          {strings.home.noBooks}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </main>
  )
}
