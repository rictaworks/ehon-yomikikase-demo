import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import worker from "../src/index";
import type { Env } from "../src/env";
import { isHoneypotEmpty } from "../src/honeypot";
import { secretsMatch } from "../src/security";
import { createTestD1 } from "./helpers/d1";

const ADMIN_KEY = "test-admin-key";
const app = createApp();

function setup(withAdminKey = true): { env: Env; DB: D1Database } {
  const DB = createTestD1();
  const env: Env = withAdminKey ? { DB, ADMIN_INTERNAL_KEY: ADMIN_KEY } : { DB };
  return { env, DB };
}

function sessionCookieFrom(res: Response): string {
  const header = res.headers.get("set-cookie") ?? "";
  const match = /ehon_session_id=([^;]+)/.exec(header);
  if (!match?.[1]) {
    throw new Error("session cookie was not set");
  }
  return `ehon_session_id=${match[1]}`;
}

function postJson(body: unknown, cookie?: string): RequestInit {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (cookie) {
    headers.cookie = cookie;
  }
  return { method: "POST", headers, body: JSON.stringify(body) };
}

describe("books and categories", () => {
  it("lists the three master books with their category names", async () => {
    const { env } = setup();
    const res = await app.request("/api/books", {}, env);
    expect(res.status).toBe(200);
    const books = (await res.json()) as { id: number; categoryName: string }[];
    expect(books.map((b) => b.id)).toEqual([1, 2, 3]);
    expect(books[0]?.categoryName).toBe("どうぶつ");
  });

  it("filters books by categoryId and age range", async () => {
    const { env } = setup();
    const byCategory = (await (await app.request("/api/books?categoryId=4", {}, env)).json()) as { id: number }[];
    expect(byCategory.map((b) => b.id)).toEqual([3]);

    const byAge = (await (await app.request("/api/books?ageMin=6&ageMax=6", {}, env)).json()) as { id: number }[];
    expect(byAge.map((b) => b.id)).toEqual([3]);
  });

  it("rejects a non-numeric categoryId with 400", async () => {
    const { env } = setup();
    const res = await app.request("/api/books?categoryId=abc", {}, env);
    expect(res.status).toBe(400);
  });

  it("returns one book, 404 for unknown ids, and 400 for malformed ids", async () => {
    const { env } = setup();
    const ok = await app.request("/api/books/1", {}, env);
    expect(ok.status).toBe(200);
    expect(((await ok.json()) as { totalPages: number }).totalPages).toBe(5);

    expect((await app.request("/api/books/999", {}, env)).status).toBe(404);
    expect((await app.request("/api/books/abc", {}, env)).status).toBe(400);
  });

  it("lists the five categories in priority order", async () => {
    const { env } = setup();
    const res = await app.request("/api/categories", {}, env);
    const categories = (await res.json()) as { name: string }[];
    expect(categories.map((c) => c.name)).toEqual(["どうぶつ", "自然", "家族", "乗り物", "その他"]);
  });
});

describe("pages", () => {
  it("lists all pages of a book and returns a single page when page is given", async () => {
    const { env } = setup();
    const all = (await (await app.request("/api/books/1/pages", {}, env)).json()) as unknown[];
    expect(all).toHaveLength(5);

    const one = (await (await app.request("/api/books/1/pages?page=3", {}, env)).json()) as { pageNumber: number };
    expect(one.pageNumber).toBe(3);

    expect((await app.request("/api/books/1/pages?page=9", {}, env)).status).toBe(404);
    expect((await app.request("/api/books/1/pages?page=x", {}, env)).status).toBe(400);
  });
});

describe("progress and history", () => {
  it("saves progress for a new visitor and reads it back with the issued cookie", async () => {
    const { env } = setup();
    const saved = await app.request("/api/progress", postJson({ bookId: 1, lastPage: 3, hp_email: "" }), env);
    expect(saved.status).toBe(200);
    const cookie = sessionCookieFrom(saved);

    const read = await app.request("/api/progress?bookId=1", { headers: { cookie } }, env);
    expect(await read.json()).toEqual({ lastPage: 3 });
  });

  it("returns null progress for a visitor without a session", async () => {
    const { env } = setup();
    const res = await app.request("/api/progress?bookId=2", {}, env);
    expect(await res.json()).toEqual({ lastPage: null });
  });

  it("keeps the history newest first", async () => {
    const { env } = setup();
    const first = await app.request("/api/history", postJson({ bookId: 1, hp_email: "" }), env);
    const cookie = sessionCookieFrom(first);
    await app.request("/api/history", postJson({ bookId: 2, hp_email: "" }, cookie), env);

    const recent = (await (await app.request("/api/history", { headers: { cookie } }, env)).json()) as { id: number }[];
    expect(recent.map((b) => b.id)).toEqual([2, 1]);
  });

  it("rejects progress beyond the last page and history for unknown books", async () => {
    const { env } = setup();
    const tooFar = await app.request("/api/progress", postJson({ bookId: 1, lastPage: 99, hp_email: "" }), env);
    expect(tooFar.status).toBe(400);

    const unknown = await app.request("/api/history", postJson({ bookId: 999, hp_email: "" }), env);
    expect(unknown.status).toBe(404);
  });

  it("requires a valid bookId on GET /api/progress", async () => {
    const { env } = setup();
    expect((await app.request("/api/progress", {}, env)).status).toBe(400);
    expect((await app.request("/api/progress?bookId=zz", {}, env)).status).toBe(400);
  });

  it("rejects a filled honeypot field with 400 and stores nothing", async () => {
    const { env, DB } = setup();
    const res = await app.request(
      "/api/progress",
      postJson({ bookId: 1, lastPage: 2, hp_email: "bot@example.com" }),
      env
    );
    expect(res.status).toBe(400);
    const count = await DB.prepare("SELECT COUNT(*) AS n FROM reading_progress").first<{ n: number }>();
    expect(count?.n).toBe(0);
  });

  it("issues a session id on GET /api/session and keeps it for the same cookie", async () => {
    const { env } = setup();
    const first = await app.request("/api/session", {}, env);
    const cookie = sessionCookieFrom(first);
    const body = (await first.json()) as { sessionId: string };
    expect(body.sessionId).toMatch(/^[0-9a-f-]{36}$/);

    const again = await app.request("/api/session", { headers: { cookie } }, env);
    expect(((await again.json()) as { sessionId: string }).sessionId).toBe(body.sessionId);
  });
});

describe("admin reset and daily reset", () => {
  it("returns 503 when the admin key is not configured", async () => {
    const { env } = setup(false);
    const res = await app.request("/api/admin/reset", { method: "POST" }, env);
    expect(res.status).toBe(503);
  });

  it("returns 401 for a wrong bearer token", async () => {
    const { env } = setup();
    const res = await app.request("/api/admin/reset", { method: "POST", headers: { Authorization: "Bearer wrong" } }, env);
    expect(res.status).toBe(401);
  });

  it("clears visitor data but keeps the master books when reset is called with the key", async () => {
    const { env, DB } = setup();
    const saved = await app.request("/api/progress", postJson({ bookId: 1, lastPage: 4, hp_email: "" }), env);
    const cookie = sessionCookieFrom(saved);

    const res = await app.request(
      "/api/admin/reset",
      { method: "POST", headers: { Authorization: `Bearer ${ADMIN_KEY}` } },
      env
    );
    expect(res.status).toBe(200);

    const after = await app.request("/api/progress?bookId=1", { headers: { cookie } }, env);
    expect(await after.json()).toEqual({ lastPage: null });

    const books = await DB.prepare("SELECT COUNT(*) AS n FROM books WHERE is_master = 1").first<{ n: number }>();
    expect(books?.n).toBe(3);
  });

  it("runs the same purge from the scheduled handler", async () => {
    const { env, DB } = setup();
    await app.request("/api/history", postJson({ bookId: 3, hp_email: "" }), env);
    const before = await DB.prepare("SELECT COUNT(*) AS n FROM sessions").first<{ n: number }>();
    expect(before?.n).toBe(1);

    await worker.scheduled({} as ScheduledController, env);

    const after = await DB.prepare("SELECT COUNT(*) AS n FROM sessions").first<{ n: number }>();
    expect(after?.n).toBe(0);
    const categories = await DB.prepare("SELECT COUNT(*) AS n FROM categories").first<{ n: number }>();
    expect(categories?.n).toBe(5);
  });
});

describe("routing and helpers", () => {
  it("answers unknown API paths with a JSON 404", async () => {
    const { env } = setup();
    const res = await app.request("/api/unknown", {}, env);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("compares secrets in constant time and checks the honeypot field", async () => {
    expect(await secretsMatch("same", "same")).toBe(true);
    expect(await secretsMatch("same", "other")).toBe(false);
    expect(isHoneypotEmpty({ hp_email: "" })).toBe(true);
    expect(isHoneypotEmpty({})).toBe(true);
    expect(isHoneypotEmpty({ hp_email: "x" })).toBe(false);
  });
});
