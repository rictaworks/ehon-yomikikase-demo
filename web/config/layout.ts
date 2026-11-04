/** 画面共通の固定文言と年齢フィルタの選択肢（日本語版）。 */
export const LAYOUT_TEXT = {
  demoBanner: "これはデモ版です。データはサーバー再起動時にリセットされる場合があります。",
  demoListLink: "← デモ一覧へ",
  consultButton: "ご相談はこちら",
  loadingLabel: "読み込み中",
} as const;

export const AGE_RANGES = [
  { label: "2〜3歳", min: 2, max: 3 },
  { label: "3〜4歳", min: 3, max: 4 },
  { label: "4〜5歳", min: 4, max: 5 },
  { label: "5〜6歳", min: 5, max: 6 },
] as const;
