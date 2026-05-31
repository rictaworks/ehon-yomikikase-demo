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
