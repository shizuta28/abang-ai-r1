-- Cloudflare D1 schema. D1 is SQLite, so enums are stored as TEXT.
-- Apply with: wrangler d1 execute <database> --file=database/d1/schema.sql
-- The Fastify app reaches this database through the Cloudflare D1 HTTP API
-- when DATABASE_PROVIDER=d1.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  google_id TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  locale TEXT NOT NULL DEFAULT 'bm',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_bm TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_bm TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  description_bm TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MYR',
  type TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0,
  cover_url TEXT,
  file_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MYR',
  bill_code TEXT,
  external_ref TEXT NOT NULL UNIQUE,
  payment_status TEXT,
  failure_reason TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  title TEXT NOT NULL,
  price_cents INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_records (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'toyyibpay',
  bill_code TEXT NOT NULL,
  ref_no TEXT,
  status TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  verified_at TEXT,
  raw_payload TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sales_pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_bm TEXT NOT NULL,
  title_en TEXT NOT NULL,
  body_bm TEXT NOT NULL,
  body_en TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS thread_posts (
  id TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  scheduled_at TEXT,
  published_at TEXT,
  threads_media_id TEXT,
  review_note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_type ON products (type, published);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_threads_status ON thread_posts (status, scheduled_at);
