import { Hono } from "hono";
import type { Context } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { ADMIN_KEY_HEADER, HISTORY_DEFAULT_LIMIT, MAX_HISTORY_PER_SESSION } from "./config/app";
import { MESSAGES } from "./config/messages";
import { readJsonObject } from "./body";
import { DemoRepository } from "./db/repository";
import { ApiError } from "./errors";
import { isHoneypotEmpty } from "./honeypot";
import type { Env } from "./env";
import { resolveSession, touchOrCreateSession } from "./session";
import { secretsMatch } from "./security";
import type { BookFilter } from "./types";

type AppEnv = { Bindings: Env };
type AppContext = Context<AppEnv>;

const INTEGER_PATTERN = /^-?\d+$/;

function parseInteger(raw: string): number | null {
  if (!INTEGER_PATTERN.test(raw)) {
    return null;
  }
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : null;
}

function parsePathBookId(raw: string): number {
  const bookId = parseInteger(raw);
  if (bookId === null) {
    throw new ApiError(400, MESSAGES.invalidBookId);
  }
  return bookId;
}

function isSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

function assertHoneypotEmpty(body: Record<string, unknown>): void {
  if (!isHoneypotEmpty(body)) {
    throw new ApiError(400, MESSAGES.badRequest);
  }
}

function parseBookFilter(c: AppContext): BookFilter {
  const filter: BookFilter = {};

  const categoryId = c.req.query("categoryId");
  if (categoryId !== undefined) {
    const parsed = parseInteger(categoryId);
    if (parsed === null) {
      throw new ApiError(400, MESSAGES.invalidCategoryId);
    }
    filter.categoryId = parsed;
  }

  const ageMin = c.req.query("ageMin");
  if (ageMin !== undefined) {
    const parsed = parseInteger(ageMin);
    if (parsed === null) {
      throw new ApiError(400, MESSAGES.invalidAgeMin);
    }
    filter.ageMin = parsed;
  }

  const ageMax = c.req.query("ageMax");
  if (ageMax !== undefined) {
    const parsed = parseInteger(ageMax);
    if (parsed === null) {
      throw new ApiError(400, MESSAGES.invalidAgeMax);
    }
    filter.ageMax = parsed;
  }

  return filter;
}

export function createApp(): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  const repo = (c: AppContext): DemoRepository => new DemoRepository(c.env.DB);

  // API の応答は JSON のみ。埋め込み先・MIME 推測・フレーミングを抑えるヘッダを全応答に付ける。
  app.use(
    "*",
    secureHeaders({
      contentSecurityPolicy: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"]
      },
      referrerPolicy: "no-referrer",
      xFrameOptions: "DENY",
      crossOriginResourcePolicy: "same-origin"
    })
  );

  app.onError((err, c) => {
    if (err instanceof ApiError) {
      return c.json({ error: err.message }, err.status);
    }
    console.error("[api] unhandled error:", err);
    return c.json({ error: MESSAGES.internalError }, 500);
  });

  app.notFound((c) => c.json({ error: MESSAGES.notFound }, 404));

  app.get("/api/categories", async (c) => {
    return c.json(await repo(c).listCategories());
  });

  app.get("/api/books", async (c) => {
    return c.json(await repo(c).listBooks(parseBookFilter(c)));
  });

  app.get("/api/books/:id", async (c) => {
    const bookId = parsePathBookId(c.req.param("id"));
    const book = await repo(c).findBook(bookId);
    if (!book) {
      throw new ApiError(404, MESSAGES.bookNotFound);
    }
    return c.json(book);
  });

  app.get("/api/books/:id/pages", async (c) => {
    const bookId = parsePathBookId(c.req.param("id"));
    const repository = repo(c);

    const pageParam = c.req.query("page");
    if (pageParam !== undefined) {
      const pageNumber = parseInteger(pageParam);
      if (pageNumber === null) {
        throw new ApiError(400, MESSAGES.invalidPageNumber);
      }
      const page = await repository.findPage(bookId, pageNumber);
      if (!page) {
        throw new ApiError(404, MESSAGES.pageNotFound);
      }
      return c.json(page);
    }

    return c.json(await repository.listPages(bookId));
  });

  app.get("/api/history", async (c) => {
    const repository = repo(c);
    const sessionId = await resolveSession(c, repository);
    return c.json(await repository.listRecentBooks(sessionId, HISTORY_DEFAULT_LIMIT));
  });

  app.post("/api/history", async (c) => {
    const body = await readJsonObject(c.req.raw);
    assertHoneypotEmpty(body);

    const bookId = body.bookId;
    if (!isSafeInteger(bookId)) {
      throw new ApiError(400, MESSAGES.invalidRequestBody);
    }

    const repository = repo(c);
    const book = await repository.findBook(bookId);
    if (!book) {
      throw new ApiError(404, MESSAGES.bookNotFound);
    }

    const sessionId = await resolveSession(c, repository);
    if ((await repository.countHistory(sessionId)) >= MAX_HISTORY_PER_SESSION) {
      throw new ApiError(429, MESSAGES.tooManyHistoryEntries);
    }
    await repository.addHistory(sessionId, bookId, new Date().toISOString());
    return c.json({ ok: true });
  });

  app.get("/api/progress", async (c) => {
    const bookIdParam = c.req.query("bookId");
    if (!bookIdParam) {
      throw new ApiError(400, MESSAGES.bookIdRequired);
    }
    const bookId = parseInteger(bookIdParam);
    if (bookId === null) {
      throw new ApiError(400, MESSAGES.invalidBookIdParam);
    }

    const repository = repo(c);
    const sessionId = await resolveSession(c, repository);
    return c.json({ lastPage: await repository.findProgress(sessionId, bookId) });
  });

  app.post("/api/progress", async (c) => {
    const body = await readJsonObject(c.req.raw);
    assertHoneypotEmpty(body);

    const { bookId, lastPage } = body;
    if (!isSafeInteger(bookId) || !isSafeInteger(lastPage)) {
      throw new ApiError(400, MESSAGES.invalidRequestBody);
    }

    const repository = repo(c);
    const book = await repository.findBook(bookId);
    if (!book) {
      throw new ApiError(404, MESSAGES.bookNotFound);
    }
    if (lastPage < 1 || lastPage > book.totalPages) {
      throw new ApiError(400, MESSAGES.invalidPageNumber);
    }

    const sessionId = await resolveSession(c, repository);
    await repository.saveProgress(sessionId, bookId, lastPage, new Date().toISOString());
    return c.json({ ok: true });
  });

  app.get("/api/session", async (c) => {
    const sessionId = await touchOrCreateSession(c, repo(c));
    return c.json({ sessionId });
  });

  app.post("/api/admin/reset", async (c) => {
    const expectedKey = c.env.ADMIN_INTERNAL_KEY;
    if (!expectedKey) {
      throw new ApiError(503, MESSAGES.adminKeyNotConfigured);
    }
    const provided = c.req.header(ADMIN_KEY_HEADER) ?? "";
    if (!(await secretsMatch(provided, `Bearer ${expectedKey}`))) {
      throw new ApiError(401, MESSAGES.unauthorized);
    }
    await repo(c).purgeDemoData();
    return c.json({ ok: true });
  });

  return app;
}
