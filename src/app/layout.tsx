import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faHistory } from "@fortawesome/free-solid-svg-icons"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import SpeechWarningBanner from "@/app/components/SpeechWarningBanner"
import { getStrings } from "@/lib/config/strings"

config.autoAddCss = false

const strings = getStrings()

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: strings.appTitle,
  description: strings.appDescription,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        <SpeechWarningBanner />

        <header className="bg-indigo-600 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-extrabold hover:text-indigo-100 transition-colors duration-150"
            >
              <FontAwesomeIcon icon={faBook} className="w-7 h-7" />
              <span>{strings.appTitle}</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-base font-semibold hover:text-indigo-100 transition-colors duration-150"
              >
                <FontAwesomeIcon icon={faBook} className="w-4 h-4" />
                {strings.nav.home}
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 text-base font-semibold hover:text-indigo-100 transition-colors duration-150"
              >
                <FontAwesomeIcon icon={faHistory} className="w-4 h-4" />
                {strings.nav.history}
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex flex-col flex-1">{children}</div>

        <footer className="bg-indigo-50 border-t border-indigo-100 text-center text-sm text-gray-500 py-4 px-4 mt-auto">
          {strings.appTitle}
        </footer>
      </body>
    </html>
  )
}
