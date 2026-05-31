"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter, faTag, faChildReaching } from "@fortawesome/free-solid-svg-icons"
import { Category } from "@/lib/types"
import { getStrings } from "@/lib/config/strings"

const strings = getStrings()

type Props = {
  categories: Category[]
}

const AGE_OPTIONS = [
  { label: strings.home.ageAll, min: undefined, max: undefined },
  { label: "2〜3歳", min: 2, max: 3 },
  { label: "3〜4歳", min: 3, max: 4 },
  { label: "4〜5歳", min: 4, max: 5 },
  { label: "5〜6歳", min: 5, max: 6 },
]

export default function FilterBar({ categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get("categoryId") ?? ""
  const currentAgeMin = searchParams.get("ageMin") ?? ""
  const currentAgeMax = searchParams.get("ageMax") ?? ""

  function buildUrl(params: {
    categoryId?: string
    ageMin?: string
    ageMax?: string
  }): string {
    const next = new URLSearchParams()
    const categoryId = params.categoryId ?? currentCategoryId
    const ageMin = params.ageMin !== undefined ? params.ageMin : currentAgeMin
    const ageMax = params.ageMax !== undefined ? params.ageMax : currentAgeMax

    if (categoryId) next.set("categoryId", categoryId)
    if (ageMin) next.set("ageMin", ageMin)
    if (ageMax) next.set("ageMax", ageMax)

    const qs = next.toString()
    return qs ? `/?${qs}` : "/"
  }

  function onCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    router.push(buildUrl({ categoryId: val || "" }))
  }

  function onAgeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const idx = parseInt(e.target.value, 10)
    const opt = AGE_OPTIONS[idx]
    if (!opt) return
    router.push(
      buildUrl({
        ageMin: opt.min !== undefined ? String(opt.min) : "",
        ageMax: opt.max !== undefined ? String(opt.max) : "",
      })
    )
  }

  const selectedAgeIdx = AGE_OPTIONS.findIndex(
    (o) =>
      String(o.min ?? "") === currentAgeMin &&
      String(o.max ?? "") === currentAgeMax
  )

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white rounded-2xl shadow px-5 py-4 border border-gray-100">
      <span className="flex items-center gap-2 font-bold text-gray-600 text-base">
        <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-indigo-400" />
        {strings.home.filterLabel}
      </span>

      <label className="flex items-center gap-2">
        <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-pink-400" />
        <span className="text-sm font-semibold text-gray-600 sr-only">
          {strings.home.categoryLabel}
        </span>
        <select
          aria-label={strings.home.categoryLabel}
          value={currentCategoryId}
          onChange={onCategoryChange}
          className="border border-gray-300 rounded-xl px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">{strings.home.categoryAll}</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2">
        <FontAwesomeIcon icon={faChildReaching} className="w-4 h-4 text-green-400" />
        <span className="text-sm font-semibold text-gray-600 sr-only">
          {strings.home.ageLabel}
        </span>
        <select
          aria-label={strings.home.ageLabel}
          value={selectedAgeIdx >= 0 ? String(selectedAgeIdx) : "0"}
          onChange={onAgeChange}
          className="border border-gray-300 rounded-xl px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {AGE_OPTIONS.map((opt, i) => (
            <option key={i} value={String(i)}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
