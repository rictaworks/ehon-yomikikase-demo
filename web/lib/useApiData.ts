import { useEffect, useState } from "react"
import { ApiError, getJson } from "./api"

export type ApiResult<T> =
  | { state: "loading" }
  | { state: "ready"; data: T }
  | { state: "error"; status: number | null }

type Keyed<T> = { path: string; value: ApiResult<T> }

/**
 * path の API を取得する。path が null のときは取得しない。
 * 結果は取得時の path と一緒に保持し、path が変わったら古い結果を読まない（読み込み中扱いにする）。
 */
export function useApiData<T>(path: string | null): ApiResult<T> {
  const [keyed, setKeyed] = useState<Keyed<T> | null>(null)

  useEffect(() => {
    if (path === null) {
      return
    }
    let active = true
    getJson<T>(path)
      .then((data) => {
        if (active) {
          setKeyed({ path, value: { state: "ready", data } })
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const status = err instanceof ApiError ? err.status : null
          setKeyed({ path, value: { state: "error", status } })
        }
      })
    return () => {
      active = false
    }
  }, [path])

  if (path === null || keyed === null || keyed.path !== path) {
    return { state: "loading" }
  }
  return keyed.value
}
