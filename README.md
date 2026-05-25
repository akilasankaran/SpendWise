# SpendWise

Personal expense tracker with a dashboard, category tagging, payment methods, and full CRUD — built with Next.js App Router and MongoDB.

**Live demo:** [https://spendwise-akilasankaran.vercel.app](https://spendwise-akilasankaran.vercel.app) *(set after Vercel deploy — see [Deployment](#deployment))*

**Repository:** [github.com/akilasankaran/SpendWise](https://github.com/akilasankaran/SpendWise)

## Features

- **Authentication** — Email/password register and login; expenses scoped per user
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
| Auth | Auth.js (NextAuth v5), bcrypt |
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

Edit `.env.local` and set `MONGODB_URI`, `AUTH_SECRET`, and `AUTH_URL` (see [Environment variables](#environment-variables) below).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/register` or `/login` if not signed in.

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
| `AUTH_SECRET` | Yes | Secret for JWT sessions (`openssl rand -base64 32`) |
| `AUTH_URL` | Yes | App URL (e.g. `http://localhost:3000`) |

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
├── (auth)/               # Login and register (no sidebar)
├── (dashboard)/          # Pages with sidebar layout
│   ├── page.tsx          # Dashboard
│   ├── expenses/         # List, create, edit
│   ├── error.tsx         # Error boundary
│   └── not-found.tsx     # 404 UI
├── api/auth/             # Auth.js + register
├── api/expenses/         # REST routes + export
components/
├── auth/                 # Login and register forms
├── expenses/             # Forms, filters, actions
├── layout/               # App sidebar
└── ui/                   # shadcn components
database/                 # User and Expense models
lib/                      # DB, auth, validation, query helpers
types/                    # Shared TypeScript types
auth.ts                   # Auth.js configuration
middleware.ts             # Route protection
```

## Routes

### Pages

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/` | Dashboard (protected) |
| `/expenses` | Expense list (search, filter, sort, pagination) |
| `/expenses/new` | Create expense |
| `/expenses/[id]/edit` | Edit expense |

### API

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Create user account |
| `*` | `/api/auth/[...nextauth]` | Auth.js sign-in/sign-out |
| `GET` | `/api/expenses` | List expenses (auth required) |
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

- **Auth:** Auth.js Credentials provider with JWT sessions; [`middleware.ts`](middleware.ts) protects dashboard routes.
- **Reads:** Server Components query MongoDB directly after `connection()` for Next.js 16 dynamic rendering.
- **Writes:** Client forms call REST APIs; success triggers toast + redirect or `router.refresh()`.
- **Data isolation:** Every expense has a `userId`; queries and APIs filter by the signed-in user.

## Deployment

Data is stored in **MongoDB Atlas**, not on Vercel. Redeploying the app updates code only — users and expenses persist in Atlas.

**Full guide:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Quick steps

1. **Atlas:** Network Access → allow `0.0.0.0/0`; use named databases (`spendwise-dev` local, `spendwise` production).
2. **GitHub:** Push to [akilasankaran/SpendWise](https://github.com/akilasankaran/SpendWise).
3. **Vercel:** Import repo → add env vars:

| Variable | Production |
|----------|------------|
| `MONGODB_URI` | `...mongodb.net/spendwise?retryWrites=true&w=majority` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://<your-app>.vercel.app` |

4. Deploy → smoke test register, create expense, redeploy, confirm data persists.

### Dev vs production data

| Environment | Database in URI |
|-------------|-----------------|
| Local `.env` | `spendwise-dev` |
| Vercel | `spendwise` |

Same Atlas cluster, separate databases — safe to experiment locally without affecting production.

## Resume / portfolio

**One-liner:** Full-stack expense tracker on Next.js 16 and MongoDB with server-rendered dashboard, REST APIs, and accessible CRUD UI (shadcn/ui).

**Bullet:** SpendWise — Built a personal finance app with Next.js App Router (RSC), Auth.js, MongoDB/Mongoose, and TypeScript; delivered user auth, expense CRUD, filters/pagination, CSV export, and user-scoped REST APIs.

## Roadmap

- [x] README, env template, search/filter/sort, pagination, CSV export, Zod validation
- [x] Authentication and user-scoped data
- [x] Deployment docs and dev/prod database separation
- [ ] Dashboard charts and budgets
- [ ] Unit and E2E tests
- [ ] CI/CD, Docker, recurring expenses

## License

Private — use and modify for your portfolio as needed.
