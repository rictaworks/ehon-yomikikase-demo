import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faChildReaching, faTag, faBookOpen } from "@fortawesome/free-solid-svg-icons"
import { Book } from "@/lib/types"
import { getStrings } from "@/lib/config/strings"

const strings = getStrings()

type Props = {
  book: Book
}

export default function BookCard({ book }: Props) {
  const ageRange = strings.bookCard.ageRange
    .replace("{min}", String(book.ageMin))
    .replace("{max}", String(book.ageMax))

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-200 border border-gray-100">
      <div className="relative h-52 bg-amber-50 flex items-center justify-center overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h2 className="text-xl font-bold text-gray-800 leading-tight">
          {book.title}
        </h2>

        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-indigo-400" />
            <span>
              {strings.bookDetail.author}
              {book.author}
            </span>
          </span>

          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faChildReaching} className="w-4 h-4 text-green-400" />
            <span>{ageRange}</span>
          </span>

          {book.categoryName && (
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-pink-400" />
              <span className="inline-block bg-pink-100 text-pink-700 rounded-full px-3 py-0.5 text-xs font-semibold">
                {book.categoryName}
              </span>
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <Link
            href={`/books/${book.id}`}
            className="flex items-center justify-center gap-2 w-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors duration-150 text-lg"
          >
            <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5" />
            {strings.bookCard.readButton}
          </Link>
        </div>
      </div>
    </div>
  )
}
