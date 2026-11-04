import { JSON_MEDIA_TYPE, MAX_REQUEST_BODY_BYTES } from "./config/app";
import { MESSAGES } from "./config/messages";
import { ApiError } from "./errors";

/** Content-Type の媒体型（パラメータを除いた部分）が application/json か。大文字小文字は区別しない。 */
export function isJsonContentType(header: string | null): boolean {
  if (header === null) {
    return false;
  }
  const mediaType = header.split(";")[0]?.trim().toLowerCase();
  return mediaType === JSON_MEDIA_TYPE;
}

/**
 * 本文を上限バイトまで読む。Content-Length が上限を超える場合は読まずに拒否し、
 * Content-Length が無い（chunked）場合は読みながら上限を超えた時点で打ち切る。
 */
async function readBodyText(request: Request, maxBytes: number): Promise<string> {
  const declared = request.headers.get("content-length");
  if (declared !== null && Number(declared) > maxBytes) {
    throw new ApiError(413, MESSAGES.payloadTooLarge);
  }
  if (request.body === null) {
    return "";
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new ApiError(413, MESSAGES.payloadTooLarge);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

/**
 * JSON オブジェクトの本文を読む。順序は「Content-Type → 本文サイズ → JSON 解析」。
 * 解析前に型と大きさを確かめ、想定外の本文を JSON.parse に渡さない。
 */
export async function readJsonObject(
  request: Request,
  maxBytes: number = MAX_REQUEST_BODY_BYTES
): Promise<Record<string, unknown>> {
  if (!isJsonContentType(request.headers.get("content-type"))) {
    throw new ApiError(415, MESSAGES.unsupportedMediaType);
  }

  const text = await readBodyText(request, maxBytes);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ApiError(400, MESSAGES.invalidRequestBody);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ApiError(400, MESSAGES.invalidRequestBody);
  }
  return body as Record<string, unknown>;
}
