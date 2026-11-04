import { HONEYPOT_FIELD } from "./config/app";

/** ハニーポット欄が空（未定義・null・空文字）なら人間とみなす。 */
export function isHoneypotEmpty(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return value === "" || value === undefined || value === null;
}
