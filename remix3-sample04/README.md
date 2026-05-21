# Remix 3 + Hono + Vite + Rolldown Test Project

Hono, Vite, Rolldown を組み合わせた、超高速な Remix 3 仮想DOMベースのウェブアプリケーション環境です。

## アプリケーションの構造

### サーバー・ビルド・開発環境
- **[vite.config.ts](file:///c:/prog/test/remix-test/vite.config.ts)**: Vite と `@hono/vite-dev-server` の設定。本番ビルド用に `@hono/vite-build` を組み込んでいます。
- **[rolldown.config.ts](file:///c:/prog/test/remix-test/rolldown.config.ts)**: クライアント用 JS (`public/bundle.js`) を高速にビルドするための Rolldown 設定。
- **[src/server.tsx](file:///c:/prog/test/remix-test/src/server.tsx)**: Hono によるプロダクション/開発サーバーのエントリーポイント。HTML レンダリングは `remix/ui/server` の `renderToStream` を使用してストリーミング配信されます。

### クライアント・UIコンポーネント
- **[src/root.tsx](file:///c:/prog/test/remix-test/src/root.tsx)**: アプリケーション全体のレイアウト（`<html>`, `<head>`, `<body>` などのドキュメントシェル）を定義する親コンポーネント。
- **[src/client.tsx](file:///c:/prog/test/remix-test/src/client.tsx)**: クライアントサイドでのハイドレーションのエントリーポイント。HMR (ホットリロード) 時のメモリリークと多重描画を防ぐため、`import.meta.hot.dispose` を用いたルート破棄（`root.dispose()`）が実装されています。
- **[src/components/](file:///c:/prog/test/remix-test/src/components/)**: アプリケーションの各コンポーネントが配置されています。
  - Remix 3 コンポーネントは第一引数に `handle` オブジェクトを受け取る設計となっており、状態更新の際は `handle.update()` を実行します。

---

## コマンド一覧

パッケージマネージャーには `pnpm` (推奨) もしくは `npm` を使用します。

### 開発用サーバーの起動
```sh
pnpm run dev
```
Vite と Hono による高速なホットリロード対応の開発サーバーが起動します。

### プロダクションビルド
```sh
pnpm run build
```
Vite によるサーバービルドと、Rolldown によるクライアントコードのバンドルを同時に実行し、`dist/` および `public/bundle.js` を生成します。

### 本番用サーバーの起動
```sh
pnpm run start
```
ビルドされた `dist/` ディレクトリのコードから Hono サーバーを起動します。

### 型チェック
```sh
pnpm run typecheck
```
TypeScript の静的型チェック（`tsc --noEmit`）を実行します。

