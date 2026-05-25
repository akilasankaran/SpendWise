# Deployment Guide

SpendWise runs on **Vercel** (app) and **MongoDB Atlas** (data). Redeploying only updates code — your users and expenses stay in Atlas.

## Data persistence

| Where | What lives there |
|-------|------------------|
| **Vercel** | Next.js app (stateless) — no database |
| **MongoDB Atlas** | `users` and `expenses` collections — **persistent** |
| **`.env` (local)** | Secrets only — never committed |

Same `MONGODB_URI` in local and Vercel = same data. Use **separate database names** to isolate dev from prod (recommended below).

## 1. MongoDB Atlas checklist

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)  
   Required so Vercel serverless functions can connect.
3. **Database Access** → Ensure a user exists with read/write on the cluster.
4. **Connect** → Drivers → copy connection string and set an explicit database name:

| Environment | Database name in URI | Example path segment |
|-------------|----------------------|----------------------|
| Local dev | `spendwise-dev` | `...mongodb.net/spendwise-dev?...` |
| Production | `spendwise` | `...mongodb.net/spendwise?...` |

MongoDB creates the database on first write — no manual DB creation needed.

## 2. Environment variables

### Local (`.env` or `.env.local`)

Copy from [`.env.example`](../.env.example):

```bash
cp .env.example .env.local
```

| Variable | Local value |
|----------|-------------|
| `MONGODB_URI` | Atlas URI with `/spendwise-dev` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `http://localhost:3000` |

### Production (Vercel dashboard)

Project → **Settings** → **Environment Variables** → add for **Production** (and Preview if desired):

| Variable | Production value |
|----------|------------------|
| `MONGODB_URI` | Atlas URI with `/spendwise` (not `-dev`) |
| `AUTH_SECRET` | New secret (can differ from local) |
| `AUTH_URL` | `https://<your-vercel-domain>.vercel.app` |

**Important:** After first deploy, set `AUTH_URL` to the exact production URL. Wrong `AUTH_URL` breaks Auth.js callbacks.

## 3. Deploy to Vercel

### Option A — Git integration (recommended)

1. Push code to GitHub (`akilasankaran/SpendWise`).
2. [vercel.com/new](https://vercel.com/new) → Import repository.
3. Framework: **Next.js** (auto-detected).
4. Add environment variables (section 2 above).
5. **Deploy**.

Every `git push` to `main` triggers a new deployment. **Data in Atlas is unchanged.**

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add MONGODB_URI
vercel env add AUTH_SECRET
vercel env add AUTH_URL
vercel --prod
```

## 4. Smoke test (production)

After deploy:

- [ ] Open production URL → redirects to `/login`
- [ ] Register a new account
- [ ] Create an expense
- [ ] Refresh page — expense still visible
- [ ] Sign out → sign in — data persists
- [ ] Redeploy (or push a commit) — data still persists after redeploy

## 5. Maintaining data when adding features

| Change | Data impact |
|--------|-------------|
| UI-only updates | None |
| New optional Expense fields | Old documents unaffected |
| New collections (e.g. Budget) | New collection only |
| New **required** fields | May need migration for old documents |
| Rotating `AUTH_SECRET` | All users must sign in again |

**Backup:** Use **Export CSV** in the app or Atlas **Export** before risky schema changes.

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| `MissingSecret` | Set `AUTH_SECRET` on Vercel and redeploy |
| MongoDB connection timeout | Atlas → Network Access → allow `0.0.0.0/0` |
| Auth redirect loops | `AUTH_URL` must match production URL exactly |
| Local data in prod | Use `spendwise-dev` locally and `spendwise` on Vercel |

## Security

- Never commit `.env` (gitignored).
- Rotate Atlas password if credentials were ever exposed.
- Use different `AUTH_SECRET` for production when possible.
