export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

/** 同一オリジンの Worker API を GET する。失敗は HTTP ステータス付きの ApiError で投げる。 */
export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    method: "GET",
    credentials: "same-origin",
    headers: { accept: "application/json" },
  })
  if (!res.ok) {
    throw new ApiError(res.status, `GET ${path} failed with status ${res.status}`)
  }
  return (await res.json()) as T
}

/** 同一オリジンの Worker API へ JSON を POST する。ハニーポット欄 hp_email は呼び出し側で空文字を渡す。 */
export async function postJson(path: string, body: Record<string, unknown>): Promise<void> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new ApiError(res.status, `POST ${path} failed with status ${res.status}`)
  }
}
