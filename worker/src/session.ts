import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { MAX_SESSIONS, SESSION_COOKIE_MAX_AGE_SECONDS, SESSION_COOKIE_NAME } from "./config/app";
import { MESSAGES } from "./config/messages";
import type { Env } from "./env";
import type { DemoRepository } from "./db/repository";
import { ApiError } from "./errors";

type AppContext = Context<{ Bindings: Env }>;

function cookieOptions(c: AppContext) {
  return {
    httpOnly: true,
    sameSite: "Lax" as const,
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    // https で届いたときだけ Secure を付ける（wrangler dev の http では付けない）
    secure: new URL(c.req.url).protocol === "https:"
  };
}

/**
 * 新規セッションを発行して Cookie を張る。件数上限に達していれば発行せず 429 を返す。
 * 上限は日次リセットで戻るため、既存の利用者は影響を受けない。
 */
async function createSession(c: AppContext, repo: DemoRepository): Promise<string> {
  if ((await repo.countSessions()) >= MAX_SESSIONS) {
    throw new ApiError(429, MESSAGES.tooManySessions);
  }
  const sessionId = crypto.randomUUID();
  await repo.createSession(sessionId, new Date().toISOString());
  setCookie(c, SESSION_COOKIE_NAME, sessionId, cookieOptions(c));
  return sessionId;
}

/**
 * Cookie のセッションを返す。Cookie が無い、または日次リセットで行が消えている場合は新規発行して Cookie を張り直す。
 * 旧 getOrCreate と同じ挙動（存在確認のみで touch はしない）。
 */
export async function resolveSession(c: AppContext, repo: DemoRepository): Promise<string> {
  const existing = getCookie(c, SESSION_COOKIE_NAME);
  if (existing && (await repo.findSession(existing))) {
    return existing;
  }
  return createSession(c, repo);
}

/** GET /api/session 用：既存セッションは last_seen_at を更新し、無ければ発行する。 */
export async function touchOrCreateSession(c: AppContext, repo: DemoRepository): Promise<string> {
  const existing = getCookie(c, SESSION_COOKIE_NAME);
  if (existing && (await repo.findSession(existing))) {
    await repo.touchSession(existing, new Date().toISOString());
    return existing;
  }
  return createSession(c, repo);
}
