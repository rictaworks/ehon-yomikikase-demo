export const SESSION_COOKIE_NAME = "ehon_session_id";
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const HISTORY_DEFAULT_LIMIT = 20;
export const ADMIN_KEY_HEADER = "Authorization";
/** 本文に値が入っていれば bot とみなす（ハニーポット）。フロントは空文字で送る。 */
export const HONEYPOT_FIELD = "hp_email";

/** JSON 本文の上限（バイト）。送信するのは数十バイトの項目だけなので 1 KiB で足りる。 */
export const MAX_REQUEST_BODY_BYTES = 1024;
export const JSON_MEDIA_TYPE = "application/json";

/**
 * 件数上限（README「運用・セキュリティ方針」）。匿名セッションは誰でも作れるため、
 * 日次リセット（JST 03:00）までの同時件数を抑える。上限を超えたら新規発行だけを 429 で止める。
 */
export const MAX_SESSIONS = 5000;
export const MAX_HISTORY_PER_SESSION = 500;
