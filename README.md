# Abang AI

Public learning site for courses, articles, free resources, and digital products. Members sign up with email or Google. Admins manage leads, the catalogue, orders, sales pages, and Threads drafts.

The site shell follows the rounded dark card rail, and the home header uses the “Belajar AI, Cara Mudah” layout. Bahasa Melayu is the default. English, light mode, and dark mode are in the header.

## Layout

| Folder | Role |
| --- | --- |
| `frontend` | Nuxt and Vue. Public pages and the admin portal. |
| `backend` | Fastify API, validation, sessions, and payment callback. |
| `database` | Prisma schema, PostgreSQL migrations, D1 schema, and repositories. |
| `integrations` | Google, ToyyibPay, Strapi, Cloudflare R2, and Threads. |

## What you need

- Node.js 20 or newer
- Docker, for the local PostgreSQL database

## Setup

1. Copy the environment file and fill in the values you have. Leave unused integrations blank.

   ```bash
   copy .env.example .env
   ```

2. Create a JWT secret of at least 32 characters:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

   The local database URL is:

   `postgresql://abang:abang_local_only@localhost:5432/abang`

   If Docker is not available, from the `database` folder run `npx prisma dev -d`. It prints a temporary Postgres URL. Put that value in `DATABASE_URL` and add `pgbouncer=true`. It is only for local development.

4. Install, create the tables, and load the sample catalogue:

   ```bash
   npm install
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

5. Open `http://localhost:3000`. The API listens on port `4000`. The site calls it through `/api`, so the browser stays on one origin and the session cookie works.

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding if you want a password admin. A Google account listed in `ADMIN_EMAILS` becomes an admin after a verified Google login.

## Language and theme

The header switches Bahasa Melayu and English, and light and dark mode. The choice is stored in a cookie. A signed-in member’s language is also saved on their account.

Marketing copy for the shell lives in `frontend/composables/useLocale.js`. Articles, lessons, and learning notes come from Strapi. Sales pages are edited in the admin portal.

## Database

`DATABASE_PROVIDER` chooses the driver. The repositories expose the same methods either way.

- `postgres` uses `DATABASE_URL` with Prisma. This is the default for the Linux, Docker, and PM2 setup.
- `hyperdrive` uses `HYPERDRIVE_DATABASE_URL`. Hyperdrive speaks the Postgres wire protocol, so Prisma still runs the queries. Apply migrations to the origin database, then point the app at the Hyperdrive connection string. Add `pgbouncer=true` to that URL so Prisma does not reuse prepared statements through the pooler.
- `d1` uses the Cloudflare D1 HTTP API. Apply `database/d1/schema.sql` first:

  ```bash
  wrangler d1 execute <database-name> --file=database/d1/schema.sql
  ```

  Then set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and `CLOUDFLARE_API_TOKEN`.

## Google sign-in

Create an OAuth client and set the authorized redirect URI to `GOOGLE_REDIRECT_URI`. For local development that is:

`http://localhost:3000/api/auth/google/callback`

`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` stay in `.env`.

## ToyyibPay

Checkout creates a pending order, then a ToyyibPay bill. The buyer returns to `/checkout/return`, which only displays status.

The order is marked paid only after ToyyibPay calls `POST /api/payments/toyyibpay/callback` and `getBillTransactions` confirms a successful payment for the same bill, reference, and amount. A callback status on its own is not enough. If the verification API cannot be reached, the callback answers `503` so ToyyibPay can retry. Admins can cancel a pending order. They cannot mark an order paid by hand.

Use `https://dev.toyyibpay.com` until the category is live. `TOYYIBPAY_CALLBACK_URL` must be a public HTTPS URL that reaches the API.

## Strapi

Articles, lessons, and learning resources are read from Strapi. Create three collection types:

- Article: `title`, `slug`, `excerpt`, `body`
- Lesson: `title`, `slug`, `body`, `courseSlug`, `position`
- Resource: `title`, `slug`, `summary`, `body`

Set `STRAPI_URL` and `STRAPI_API_TOKEN`. If Strapi is not configured, the site shows built-in sample articles so the pages can still be reviewed. The response includes `source: "fallback"` in that case.

## Cloudflare R2

Course files, PDFs, and images go to a private R2 bucket. The admin upload stores an object key. Downloads use a short-lived signed URL after the API checks that the member is logged in and, for paid items, has a verified order.

Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET`.

## Threads

The admin board moves a post from draft, to review, to scheduled. Scheduling works without Meta credentials. Publishing and the one-minute scheduler call the Threads API only when `THREADS_USER_ID` and `THREADS_ACCESS_TOKEN` are set.

## Deployment

`docker compose up --build` starts Postgres, the API, and the site.

On a Linux server, build the site and run both processes with PM2:

```bash
npm run build
pm2 start ecosystem.config.cjs
```

Put the public site behind HTTPS. Point ToyyibPay’s callback at `https://your-domain/api/payments/toyyibpay/callback`.

## Checks

```bash
npm test
```

The payment tests lock the rule that a callback is not treated as paid until the gateway verification agrees on the amount.
