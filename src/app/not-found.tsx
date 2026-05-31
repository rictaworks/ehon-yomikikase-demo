import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { getStrings } from "@/lib/config/strings"

const strings = getStrings()

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-20">
      <FontAwesomeIcon
        icon={faExclamationCircle}
        className="w-16 h-16 text-indigo-300"
      />
      <h1 className="text-4xl font-extrabold text-gray-800">
        {strings.notFound.heading}
      </h1>
      <p className="text-lg text-gray-500 text-center max-w-sm">
        {strings.notFound.message}
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-lg transition-colors duration-150"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        {strings.notFound.backButton}
      </Link>
    </main>
  )
}
