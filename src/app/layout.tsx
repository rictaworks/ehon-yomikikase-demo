import type { Metadata } from "next"
import Script from "next/script"
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
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C04W1XKS16" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C04W1XKS16');
        `}</Script>
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        {/* アンバーバナー */}
        <div className="bg-amber-400 text-amber-900 text-center text-sm font-medium py-2 px-4">
          これはデモ版です。データはサーバー再起動時にリセットされる場合があります。
        </div>

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
              <span className="border-l border-indigo-400 pl-4">
                <a
                  href="https://rictaworks.jp/#demos"
                  className="text-base font-semibold hover:text-indigo-100 transition-colors duration-150"
                >
                  ← デモ一覧へ
                </a>
              </span>
            </nav>
          </div>
        </header>

        <div className="flex flex-col flex-1">{children}</div>

        <footer className="bg-indigo-50 border-t border-indigo-100 text-center text-sm text-gray-500 py-4 px-4 mt-auto">
          {strings.appTitle}
        </footer>

        {/* 右下固定ご相談ボタン */}
        <a
          href="https://rictaworks.jp/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem" }}
          className="bg-indigo-600 text-white text-sm font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-150"
        >
          💬 ご相談はこちら
        </a>
      </body>
    </html>
  )
}
