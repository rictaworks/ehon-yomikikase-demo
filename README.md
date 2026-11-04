# 絵本読み聞かせデモ（ehon-yomikikase-demo）

絵本を選んでAI音声で読み聞かせを体験できるデモアプリケーション。

## 自動ログイン（開発環境）

開発環境では認証をスキップして自動ログイン状態になります。

```
NODE_ENV=development / RAILS_ENV=development
```

本番環境では Google ログインが必要です。

---

## ページ一覧

| ページ名 | URL |
|---------|-----|
| トップページ | [/](http://localhost:3000/) |
| 絵本一覧 | [/books](http://localhost:3000/books) |
| 絵本詳細 | [/books/:id](http://localhost:3000/books/:id) |
| 読み聞かせ | [/books/:id/read](http://localhost:3000/books/:id/read) |
| ログイン | [/login](http://localhost:3000/login) |
| 管理画面 - ダッシュボード | [/admin](http://localhost:3000/admin) |
| 管理画面 - 絵本管理 | [/admin/books](http://localhost:3000/admin/books) |
| 管理画面 - ユーザー管理 | [/admin/users](http://localhost:3000/admin/users) |

---

## API 一覧

仕様書: [SPEC/api.md](SPEC/api.md)

| タイトル | エンドポイント |
|---------|--------------|
| 絵本一覧取得 | `GET /api/v1/books` |
| 絵本詳細取得 | `GET /api/v1/books/:id` |
| 絵本作成（管理者） | `POST /api/v1/admin/books` |
| 絵本更新（管理者） | `PATCH /api/v1/admin/books/:id` |
| 読み聞かせセッション開始 | `POST /api/v1/books/:id/sessions` |
| 音声取得 | `GET /api/v1/books/:id/audio` |
| ユーザー情報取得 | `GET /api/v1/me` |
| Google OAuth コールバック | `GET /auth/google/callback` |
| ユーザー一覧（管理者） | `GET /api/v1/admin/users` |

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | Next.js |
| バックエンド | Ruby on Rails (API mode) |
| データベース | PostgreSQL |
| AI・音声処理 | FastAPI (Python) |
| 認証 | Google OAuth 2.0 |
| デプロイ（フロント） | Vercel |
| デプロイ（バック） | Render / Railway |

## 多言語対応

日本語 / English / Francais / 中文 / Русский / Espanol / العربية

---

## 開発者向け

- 開発環境: [ENV/DEVELOPMENT.md](ENV/DEVELOPMENT.md)
- 本番環境: [ENV/PRODUCTION.md](ENV/PRODUCTION.md)
- 仕様書: [SPEC/](SPEC/)
- タスク: [TASKS/](TASKS/)
- バグ報告: [DEBUG/](DEBUG/)

---

## Cloudflare 版（Workers + D1）の構成と運用

- 構成: `worker/`（Hono の API。`/api/*` のみ Worker が処理）、`web/`（Next.js の静的書き出し。`web/out` を Workers Assets で配信）、`migrations/`（D1 のスキーマと絵本マスタ）。旧 `src/`（Next.js API Routes・SQLite）は移行後も残しており、本番では使わない。
- ローカル確認: `npm install` → `npm run db:migrate:local` → `cd web && npm install && npm run build && cd ..` → `npm run dev`（wrangler dev、既定 http://localhost:8787）。`npm test` で Worker の単体・結合テスト。
- 日次リセット: JST 03:00（cron `0 18 * * *`）。利用者データだけを削除し、絵本マスタは残す。手動実行は `POST /api/admin/reset`（`Authorization: Bearer <ADMIN_INTERNAL_KEY>`）。
- 秘密の名前は `ADMIN_INTERNAL_KEY` の 1 つだけ（`wrangler secret put ADMIN_INTERNAL_KEY`）。値はリポジトリに書かない。

### 運用・セキュリティ方針

- 匿名の書き込みと `GET /api/session` の濫用対策は件数上限で行う。Cloudflare の Rate Limiting は本番で未設定のため、公開前に併用を検討する。
  - 利用者セッションは同時 5000 件まで（`MAX_SESSIONS`）。超えると新規発行だけを 429 で止める。Cookie を持つ既存の利用者は影響を受けず、日次リセットで戻る。
  - 1 セッションの閲覧履歴は 500 件まで（`MAX_HISTORY_PER_SESSION`）。超えると 429。
- JSON 本文は解析の前に確かめる。`Content-Type` が `application/json` でなければ 415、1 KiB を超えれば 413。
- 防御ヘッダ: API 応答は hono の `secureHeaders`（CSP `default-src 'none'`、`nosniff`、`Referrer-Policy: no-referrer`）。静的ページは `web/public/_headers`（CSP、`X-Frame-Options: DENY`、HSTS など）。CSP の `'unsafe-inline'` は、Next.js の静的書き出しが埋め込むスクリプトと GA の初期化のために必要。
- ハニーポット: 本文の `hp_email` が空でなければ 400 を返す。
