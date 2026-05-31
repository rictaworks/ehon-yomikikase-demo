"use client"

import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons"
import { getStrings, SPEECH_SPEEDS, SpeechSpeed, DEFAULT_SPEECH_SPEED } from "@/lib/config/strings"

const strings = getStrings()

type Props = {
  text: string
}

export default function SpeechPlayer({ text }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [speed, setSpeed] = useState<SpeechSpeed>(DEFAULT_SPEECH_SPEED)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return
    }
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [text])

  function handleSpeak() {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return
    }

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = speed
    utterance.lang = "ja-JP"

    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  function handleSpeedChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = parseFloat(e.target.value) as SpeechSpeed
    setSpeed(val)
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl shadow px-5 py-4 border border-gray-100">
      <button
        type="button"
        onClick={handleSpeak}
        aria-pressed={speaking}
        className={`flex items-center gap-2 font-bold px-5 py-3 rounded-xl text-white text-base transition-colors duration-150 ${
          speaking
            ? "bg-red-500 hover:bg-red-600 active:bg-red-700"
            : "bg-green-500 hover:bg-green-600 active:bg-green-700"
        }`}
      >
        <FontAwesomeIcon
          icon={speaking ? faStop : faPlay}
          className="w-4 h-4"
        />
        {speaking ? strings.readPage.stopButton : strings.readPage.speakButton}
      </button>

      <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
        <span>{strings.readPage.speedLabel}</span>
        <select
          value={String(speed)}
          onChange={handleSpeedChange}
          aria-label={strings.readPage.speedLabel}
          className="border border-gray-300 rounded-xl px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {SPEECH_SPEEDS.map((s) => (
            <option key={s} value={String(s)}>
              {s}x
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
