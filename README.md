# SpendWise

Personal expense tracker with a dashboard, category tagging, payment methods, and full CRUD — built with Next.js App Router and MongoDB.

## Features

- **Dashboard** — Total expense count, total amount, and five most recent expenses
- **Expense list** — Search, filter by category/payment method, sort, and pagination
- **Create / edit** — Forms with category, payment method, tags, notes, and validation
- **Delete** — Confirmation dialog before removing an expense
- **REST API** — `GET/POST /api/expenses`, `GET/PUT/DELETE /api/expenses/[id]`, CSV export
- **Sidebar navigation** — Dashboard, expenses list, and add expense

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Partial Prerender) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Language | TypeScript |
| Database | MongoDB, Mongoose 8 |
| Validation | Zod |
| Feedback | Sonner (toasts) |

## Prerequisites

- **Node.js** 20 or later
- **npm** (or pnpm / yarn)
- **MongoDB** — [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier or a local instance

## Quick start

```bash
git clone <your-repo-url>
cd SpendWise
npm install
cp .env.example .env.local
```

Edit `.env.local` and set `MONGODB_URI` (see [MongoDB setup](#mongodb-setup) below).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## MongoDB setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database** → **Connect** → **Drivers**, copy the connection string.
3. Replace `<password>` and set the database name in the URI.
4. Paste the URI into `.env.local` as `MONGODB_URI`.

For local MongoDB:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/spendwise
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |

See [`.env.example`](.env.example) for a template.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
├── (dashboard)/          # Pages with sidebar layout
│   ├── page.tsx          # Dashboard
│   ├── expenses/         # List, create, edit
│   ├── error.tsx         # Error boundary
│   └── not-found.tsx     # 404 UI
├── api/expenses/         # REST routes + export
components/
├── expenses/             # Forms, filters, actions
├── layout/               # App sidebar
└── ui/                   # shadcn components
database/                 # Mongoose models
lib/                      # DB, validation, query helpers
types/                    # Shared TypeScript types
```

## Routes

### Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/expenses` | Expense list (search, filter, sort, pagination) |
| `/expenses/new` | Create expense |
| `/expenses/[id]/edit` | Edit expense |

### API

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/expenses` | List expenses (`?page`, `limit`, `q`, `category`, `paymentMethod`, `sort`) |
| `POST` | `/api/expenses` | Create expense |
| `GET` | `/api/expenses/export` | Download expenses as CSV |
| `GET` | `/api/expenses/[id]` | Get one expense |
| `PUT` | `/api/expenses/[id]` | Update expense |
| `DELETE` | `/api/expenses/[id]` | Delete expense |

**Query parameters for list:**

| Param | Values | Default |
|-------|--------|---------|
| `page` | 1+ | `1` |
| `limit` | 1–100 | `10` |
| `q` | Search in title | — |
| `category` | `travel`, `food`, `accommodation`, `other` | — |
| `paymentMethod` | `cash`, `upi`, `credit-card`, etc. | — |
| `sort` | `date-desc`, `date-asc`, `amount-desc`, `amount-asc` | `date-desc` |

## Architecture

- **Reads:** Server Components query MongoDB directly after `connection()` for Next.js 16 dynamic rendering.
- **Writes:** Client forms call REST APIs; success triggers toast + redirect or `router.refresh()`.
- **Layout:** [`app/(dashboard)/layout.tsx`](app/(dashboard)/layout.tsx) wraps pages with `SidebarProvider` and suspends the sidebar for `usePathname()`.

## Deployment

1. Push to GitHub and import the repo on [Vercel](https://vercel.com).
2. Add `MONGODB_URI` in **Project Settings → Environment Variables**.
3. Allow your Atlas cluster IP `0.0.0.0/0` (or Vercel’s IPs) in Atlas **Network Access**.
4. Deploy; Vercel runs `npm run build` automatically.

## Resume / portfolio

**One-liner:** Full-stack expense tracker on Next.js 16 and MongoDB with server-rendered dashboard, REST APIs, and accessible CRUD UI (shadcn/ui).

**Bullet:** SpendWise — Built a personal finance app with Next.js App Router (RSC), MongoDB/Mongoose, and TypeScript; delivered expense CRUD, filters/pagination, CSV export, Zod validation, and REST APIs with indexed queries.

## Roadmap

- [x] README, env template, search/filter/sort, pagination, CSV export, Zod validation
- [ ] Authentication and user-scoped data
- [ ] Dashboard charts and budgets
- [ ] Unit and E2E tests
- [ ] CI/CD, Docker, recurring expenses

## License

Private — use and modify for your portfolio as needed.
