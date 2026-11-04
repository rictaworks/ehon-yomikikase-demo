"use client"

import { useSyncExternalStore } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { getStrings } from "@/config/strings"

const strings = getStrings()

// 静的書き出しの HTML では未対応扱い（false）にし、クライアントの描画後に実際の判定へ切り替える。
function subscribeNoop(): () => void {
  return () => {}
}

function isUnsupported(): boolean {
  return typeof window !== "undefined" && !window.speechSynthesis
}

export default function SpeechWarningBanner() {
  const unsupported = useSyncExternalStore(subscribeNoop, isUnsupported, () => false)

  if (!unsupported) {
    return null
  }

  return (
    <div
      role="alert"
      className="flex items-center gap-3 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 text-base font-medium"
    >
      <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 flex-shrink-0" />
      <span>{strings.speechWarning.message}</span>
    </div>
  )
}
