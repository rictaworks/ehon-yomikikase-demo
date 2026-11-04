import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { MAX_HISTORY_PER_SESSION, MAX_REQUEST_BODY_BYTES, MAX_SESSIONS } from "../src/config/app";
import type { Env } from "../src/env";
import { createTestD1 } from "./helpers/d1";

const app = createApp();

function setup(): { env: Env; DB: D1Database } {
  const DB = createTestD1();
  return { env: { DB, ADMIN_INTERNAL_KEY: "test-admin-key" }, DB };
}

function sessionCookieFrom(res: Response): string {
  const match = /ehon_session_id=([^;]+)/.exec(res.headers.get("set-cookie") ?? "");
  if (!match?.[1]) {
    throw new Error("session cookie was not set");
  }
  return `ehon_session_id=${match[1]}`;
}

describe("request body checks", () => {
  it("rejects a JSON-looking body sent as text/plain with 415 before parsing", async () => {
    const { env } = setup();
    const res = await app.request(
      "/api/progress",
      { method: "POST", headers: { "content-type": "text/plain" }, body: '{"bookId":1,"lastPage":1,"hp_email":""}' },
      env
    );
    expect(res.status).toBe(415);
  });

  it("accepts application/json with a charset parameter and any letter case", async () => {
    const { env } = setup();
    const res = await app.request(
      "/api/progress",
      {
        method: "POST",
        headers: { "content-type": "Application/JSON; charset=utf-8" },
        body: JSON.stringify({ bookId: 1, lastPage: 1, hp_email: "" })
      },
      env
    );
    expect(res.status).toBe(200);
  });

  it("rejects a body whose declared length is over the limit with 413", async () => {
    const { env } = setup();
    const padding = "x".repeat(MAX_REQUEST_BODY_BYTES + 1);
    const res = await app.request(
      "/api/history",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bookId: 1, hp_email: "", padding })
      },
      env
    );
    expect(res.status).toBe(413);
  });

  it("stops a chunked body without a length header once it passes the limit", async () => {
    const { env } = setup();
    const chunk = new TextEncoder().encode("x".repeat(600));
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(chunk);
        controller.enqueue(chunk);
        controller.close();
      }
    });
    const request = new Request("http://localhost/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: stream,
      duplex: "half"
    } as RequestInit);
    const res = await app.fetch(request, env);
    expect(res.status).toBe(413);
  });
});

describe("security headers", () => {
  it("sends CSP, nosniff, and referrer policy on API responses", async () => {
    const { env } = setup();
    const res = await app.request("/api/books", {}, env);
    expect(res.headers.get("content-security-policy")).toContain("default-src 'none'");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("referrer-policy")).toBe("no-referrer");
  });
});

describe("count limits", () => {
  it("refuses a new anonymous session with 429 once the session cap is reached", async () => {
    const { env, DB } = setup();
    for (let i = 0; i < MAX_SESSIONS; i++) {
      await DB.prepare("INSERT INTO sessions (id, created_at, last_seen_at, is_master) VALUES (?, ?, ?, 0)")
        .bind(`filler-${i}`, "2026-11-04T00:00:00.000Z", "2026-11-04T00:00:00.000Z")
        .run();
    }

    const refused = await app.request("/api/session", {}, env);
    expect(refused.status).toBe(429);
    expect(refused.headers.get("set-cookie")).toBeNull();
  });

  it("keeps serving a visitor who already has a session when the cap is reached", async () => {
    const { env, DB } = setup();
    const saved = await app.request(
      "/api/progress",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bookId: 1, lastPage: 2, hp_email: "" })
      },
      env
    );
    const cookie = sessionCookieFrom(saved);
    for (let i = 0; i < MAX_SESSIONS; i++) {
      await DB.prepare("INSERT INTO sessions (id, created_at, last_seen_at, is_master) VALUES (?, ?, ?, 0)")
        .bind(`filler-${i}`, "2026-11-04T00:00:00.000Z", "2026-11-04T00:00:00.000Z")
        .run();
    }

    const read = await app.request("/api/progress?bookId=1", { headers: { cookie } }, env);
    expect(read.status).toBe(200);
    expect(await read.json()).toEqual({ lastPage: 2 });
  });

  it("refuses history beyond the per-session cap with 429", async () => {
    const { env, DB } = setup();
    const first = await app.request(
      "/api/history",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bookId: 1, hp_email: "" })
      },
      env
    );
    const cookie = sessionCookieFrom(first);
    const sessionId = cookie.replace("ehon_session_id=", "");
    for (let i = 0; i < MAX_HISTORY_PER_SESSION - 1; i++) {
      await DB.prepare("INSERT INTO reading_history (session_id, book_id, viewed_at, is_master) VALUES (?, 1, ?, 0)")
        .bind(sessionId, "2026-11-04T00:00:00.000Z")
        .run();
    }

    const res = await app.request(
      "/api/history",
      {
        method: "POST",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({ bookId: 1, hp_email: "" })
      },
      env
    );
    expect(res.status).toBe(429);
  });
});
