# storeX Monorepo

Dự án Monorepo hiện đại được quản lý bởi **Turborepo** và **Bun**, sử dụng **TypeScript** toàn diện từ frontend tới backend.

## 🏗️ Cấu trúc dự án

```text
storeX/
├── apps/
│   ├── api/                   # Backend Node.js + Fastify + TypeScript
│   │   ├── src/
│   │   │   ├── routes/        # API Routes (ví dụ: health)
│   │   │   ├── app.ts         # Fastify App factory & plugins
│   │   │   └── index.ts       # Server entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── mobile/                # Mobile React Native + Expo + NativeWind + TypeScript
│   │   ├── App.tsx            # Root component với NativeWind styling
│   │   ├── global.css         # Tailwind & NativeWind CSS
│   │   ├── metro.config.js    # Metro bundler config với NativeWind & Monorepo
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                   # Frontend React + Next.js (App Router) + TypeScript
│       ├── src/app/           # Next.js App Router (layout, page, css)
│       ├── public/
│       ├── next.config.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/                # Package chia sẻ dùng chung giữa FE và BE
│   │   ├── src/index.ts       # Shared types, models, constants, utilities
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── typescript-config/     # Cấu hình tsconfig dùng chung
│       ├── base.json          # Strict base TypeScript config
│       ├── nextjs.json        # Next.js specific TypeScript config
│       ├── node.json          # Node.js specific TypeScript config
│       └── package.json
├── .husky/
│   └── pre-commit             # Git hook chạy Biome check trước khi commit
├── biome.json                 # Cấu hình linter & formatter (Biome)
├── turbo.json                 # Cấu hình task pipelines cho Turborepo
├── package.json               # Root monorepo configuration
└── README.md
```

---

## 🚀 Công nghệ sử dụng

- **Monorepo Manager**: [Turborepo](https://turbo.build/repo) (v2)
- **Package Manager**: [Bun](https://bun.com)
- **Frontend Web**: [Next.js](https://nextjs.org) 15 (App Router) + [React](https://react.dev) 19 + TypeScript
- **Frontend Mobile**: [Expo](https://expo.dev) (SDK 57) + [React Native](https://reactnative.dev) + [NativeWind](https://nativewind.dev) (v5 / Tailwind CSS v4) + TypeScript
- **Backend**: [Node.js](https://nodejs.org) + [Fastify](https://fastify.dev) + TypeScript (dev với `tsx`, build với `tsup`)
- **Linter & Formatter**: [Biome](https://biomejs.dev)
- **Git Hooks**: [Husky](https://typicode.github.io/husky)

---

## 🛠️ Hướng dẫn cài đặt & chạy dự án

### 1. Cài đặt dependencies

```bash
bun install
```

### 2. Chạy môi trường phát triển (Dev)

Chạy đồng thời cả Frontend và Backend:

```bash
bun run dev
```

- **Web (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **API (Fastify)**: [http://localhost:4000](http://localhost:4000) (Health check: `http://localhost:4000/api/health`)

Chạy riêng lẻ từng app:

```bash
# Chỉ chạy API Backend
bun run --filter api dev

# Chỉ chạy Web Frontend
bun run --filter web dev

# Chạy Mobile App (Expo)
bun run --filter mobile dev
# Hoặc chạy trực tiếp trên simulator / device
bun run --filter mobile android
bun run --filter mobile ios
```

### 3. Build dự án

```bash
bun run build
```

### 4. Kiểm tra Type & Linter

```bash
# Kiểm tra TypeScript type checking toàn bộ repo
bun run check-types

# Kiểm tra Linter & Formatter với Biome
bun run check

# Tự động sửa lỗi Lint & Format với Biome
bun run check:fix

# Format code với Biome
bun run format
```

---

## 🐶 Git Hooks (Husky + Biome)

Mỗi khi thực hiện `git commit`, Husky sẽ tự động kích hoạt `.husky/pre-commit` để chạy:

```bash
bunx @biomejs/biome check --staged --files-ignore-unknown=true --no-errors-on-unmatched
```

Hook này sẽ kiểm tra linter & format chỉ trên các file được staged (`git add`), đảm bảo code chuẩn chỉ và sạch sẽ trước khi commit.
