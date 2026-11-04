/**
 * 静的書き出しで事前生成する絵本 ID。
 * 値は D1 の books マスタ（migrations/0002_seed_master.sql）と一致させる。
 * 絵本は利用者が追加しない固定マスタなので、この一覧だけで全ページを生成できる。
 */
export const MASTER_BOOK_IDS: readonly number[] = [1, 2, 3];
