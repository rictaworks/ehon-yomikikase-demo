export interface Env {
  DB: D1Database;
  /** 日次リセット API の鍵（wrangler secret）。未設定なら API は 503 を返す。 */
  ADMIN_INTERNAL_KEY?: string;
}
