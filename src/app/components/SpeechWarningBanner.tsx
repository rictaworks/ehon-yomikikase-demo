"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { getStrings } from "@/lib/config/strings"

const strings = getStrings()

export default function SpeechWarningBanner() {
  const [unsupported, setUnsupported] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setUnsupported(true)
    }
  }, [])

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
