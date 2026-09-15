---
name: db-mcp
description: Setup, configure, and manage any database (PostgreSQL, SQLite, MySQL, SQL Server, MongoDB) for AI consumption — schema design, connection management, vector support, and MCP server integration. Use this skill when preparing databases for AI agents or connecting them to MCP tools.
license: MIT
metadata:
  author: custom
  version: "1.0.0"
  date: July 2026
  abstract: Universal database management skill focused on making databases AI-ready and MCP-compatible. Covers schema design for AI access patterns, connection pooling, vector embeddings, read-only replicas, MCP server configuration for PostgreSQL/SQLite/MySQL/MongoDB, and security patterns for AI database interaction.
---

# DB-MCP — Database Setup for AI + MCP

Mengatur database apapun agar siap dipakai AI dan tersambung ke **MCP (Model Context Protocol)**.

> Skill ini juga punya **MCP server sendiri** (`index.js`) — bisa lo panggil langsung dari Claude Desktop, Cursor, atau MCP client lain. Tools yang tersedia: `setup_readonly_user`, `generate_mcp_config`, `create_ai_views`, `setup_vector_search`, `validate_connection`, `audit_schema`, `quickstart`. Cara connect ada di [Section 11](#11-mcp-server-skill-connect).

## Prinsip Utama

| Prinsip | Penjelasan |
|---------|------------|
| **Least Privilege** | AI cuma dikasih akses apa yang dia butuh — read-only by default |
| **Schema-First** | Struktur tabel harus jelas, AI gak bisa nebak-nebak |
| **Vector-Ready** | Embeddings harus jadi first-class citizen |
| **Connection Pooling** | AI bisa bikin banyak koneksi, pooling wajib |
| **Idempotent** | Query AI harus aman dijalanin berulang kali |

## Daftar Isi

1. [Database Prep — Apapun DB-nya](#1-database-prep)
2. [Schema Design untuk AI](#2-schema-design-untuk-ai)
3. [Vector & Embeddings](#3-vector--embeddings)
4. [Connection & Pooling](#4-connection--pooling)
5. [MCP Server Setup](#5-mcp-server-setup)
6. [Security Patterns](#6-security-patterns)
7. [Migration & Versioning](#7-migration--versioning)
8. [Monitoring AI Queries](#8-monitoring-ai-queries)
9. [Quickstart Templates](#9-quickstart-templates)
10. [Anti-Patterns](#10-anti-patterns)

---

## 1. Database Prep

### PostgreSQL (Recommended for AI)
```bash
# Install
winget install PostgreSQL.PostgreSQL  # Windows
brew install postgresql@16            # macOS
apt install postgresql-16             # Linux

# Create dedicated AI user (read-only)
CREATE USER ai_agent WITH PASSWORD 'strong_password_here';
GRANT CONNECT ON DATABASE your_db TO ai_agent;
GRANT USAGE ON SCHEMA public TO ai_agent;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_agent;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_agent;

# Create read-only replica (recommended for production)
# Use pgAdmin or: https://supabase.com/docs/guides/platform/read-replicas
```

### SQLite (Portable / Embedded)
```bash
# Install
winget install sqlite  # Windows
brew install sqlite    # macOS
apt install sqlite3    # Linux

# Set WAL mode for concurrent reads
sqlite3 your.db "PRAGMA journal_mode=WAL;"
sqlite3 your.db "PRAGMA synchronous=NORMAL;"

# Create read-only user file
# SQLite uses file permissions — set to 0444 for read-only AI access
```

### MySQL / MariaDB
```sql
CREATE USER 'ai_agent'@'%' IDENTIFIED BY 'strong_password_here';
GRANT SELECT ON your_db.* TO 'ai_agent'@'%';
FLUSH PRIVILEGES;

-- Optional: create a read-only replica
-- SET GLOBAL read_only = 1; (on replica)
```

### SQL Server
```sql
CREATE LOGIN ai_agent WITH PASSWORD = 'strong_password_here';
CREATE USER ai_agent FOR LOGIN ai_agent;
ALTER ROLE db_datareader ADD MEMBER ai_agent;
```

### MongoDB
```js
use your_db;
db.createUser({
  user: "ai_agent",
  pwd: "strong_password_here",
  roles: [{ role: "read", db: "your_db" }]
});
```

---

## 2. Schema Design untuk AI

### Wajib: View untuk AI

Bikin view khusus yang AI-friendly — flatten joins, rename kolom ambigu, tambah konteks:

```sql
CREATE VIEW ai_products AS
SELECT
  p.id,
  p.name,
  p.price,
  c.name AS category_name,
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(r.id) AS review_count,
  p.created_at
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
LEFT JOIN reviews r ON r.product_id = p.id
GROUP BY p.id, p.name, p.price, c.name, p.created_at;
```

### Wajib: Kolom Metadata untuk AI

```sql
ALTER TABLE products ADD COLUMN ai_description TEXT;
-- Isi: ringkasan kontekstual yang bisa dibaca AI
-- Contoh: "Produk elektronik kategori laptop, harga menengah, rating 4.5"
```

### Wajib: Naming Convention

| Style | Contoh | AI-friendly? |
|-------|--------|:---:|
| snake_case | `product_id` | ✅ |
| descriptive | `customer_email_address` | ✅ |
| with prefix | `prod_id`, `cust_email` | ⚠️ bikin mapping |
| cryptic | `p_id`, `ceml` | ❌ |

### Query Pattern Wajib

```sql
-- Set session biar AI gak overload
SET statement_timeout = '30s';
SET work_mem = '64MB';

-- SELECT always with LIMIT
SELECT * FROM products LIMIT 100;

-- EXPLAIN sebelum execute
EXPLAIN ANALYZE SELECT * FROM products WHERE price > 100;
```

---

## 3. Vector & Embeddings

### pgvector (PostgreSQL)

```sql
-- Install extension
CREATE EXTENSION vector;

-- Create table with embedding
CREATE TABLE product_embeddings (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  content TEXT,
  embedding VECTOR(1536)  -- OpenAI ada 1536, ada juga 384 / 768 / 3072
);

-- Create index for similarity search
CREATE INDEX ON product_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Search
SELECT
  p.name,
  pe.content,
  1 - (pe.embedding <=> '[0.001, 0.002, ...]'::vector) AS similarity
FROM product_embeddings pe
JOIN products p ON p.id = pe.product_id
ORDER BY pe.embedding <=> '[0.001, 0.002, ...]'::vector
LIMIT 10;
```

### SQLite + sqlite-vec

```bash
# Install sqlite-vec extension
# Download from: https://github.com/asg017/sqlite-vec
```

```sql
.load ./vec0
CREATE VIRTUAL TABLE vec_products USING vec0(
  embedding float[1536] distance_metric=cosine
);

INSERT INTO vec_products(rowid, embedding)
  SELECT id, embedding FROM product_embeddings;

SELECT rowid, distance
FROM vec_products
WHERE embedding MATCH '[0.001, ...]'
  AND k = 10;
```

### Embedding Generation (Node.js)

```javascript
// scripts/generate-embeddings.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmbedding(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding;
}
```

---

## 4. Connection & Pooling

### Connection String Format untuk AI

| Database | Connection String |
|----------|------------------|
| PostgreSQL | `postgresql://ai_agent:password@host:5432/db?sslmode=require&connect_timeout=10` |
| SQLite | `sqlite:///path/to/db.sqlite?mode=ro` |
| MySQL | `mysql://ai_agent:password@host:3306/db?ssl-mode=REQUIRED` |
| SQL Server | `sqlserver://ai_agent:password@host:1433;database=db;encrypt=true` |
| MongoDB | `mongodb://ai_agent:password@host:27017/db?ssl=true` |

### Pooling Config (Node.js — pg-pool)

```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.AI_DATABASE_URL,
  max: 10,              // max concurrent AI queries
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000, // kill slow queries
});

export async function queryAI(text, params) {
  const client = await pool.connect();
  try {
    await client.query('SET statement_timeout = 30000');
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
```

### Pooling Config (Python — SQLAlchemy)

```python
from sqlalchemy import create_engine

engine = create_engine(
    os.environ["AI_DATABASE_URL"],
    pool_size=5,
    max_overflow=5,
    pool_timeout=30,
    pool_pre_ping=True,
    connect_args={
        "connect_timeout": 10,
        "options": "-c statement_timeout=30000"
    }
)
```

---

## 5. MCP Server Setup

MCP (Model Context Protocol) allows AI agents (Claude, Cursor, etc.) to query your database directly.

### MCP for PostgreSQL (Recommended)

Bikin file `mcp-postgres.json`:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-postgres",
        "postgresql://ai_agent:password@localhost:5432/your_db?sslmode=require"
      ]
    }
  }
}
```

Atau pake docker:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "mcp/postgres",
        "postgresql://ai_agent:password@host.docker.internal:5432/your_db"
      ]
    }
  }
}
```

### MCP for SQLite

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": [
        "mcp-server-sqlite",
        "--db-path", "C:/data/your_database.db"
      ]
    }
  }
}
```

Atau pake npm:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-sqlite",
        "--db-path", "./data/your_database.db"
      ]
    }
  }
}
```

### MCP for MySQL

```json
{
  "mcpServers": {
    "mysql": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-mysql",
        "mysql://ai_agent:password@localhost:3306/your_db"
      ]
    }
  }
}
```

### MCP Custom Server (Node.js) — Maximum Control

Bikin `mcp-db-server.js`:

```javascript
import { Server } from '@anthropic/mcp-sdk/server.js';
import pg from 'pg';

const server = new Server({
  name: 'db-agent',
  version: '1.0.0',
});

const pool = new pg.Pool({
  connectionString: process.env.AI_DATABASE_URL,
  max: 5,
  statement_timeout: 15000,
});

server.tool(
  'query',
  'Run SQL query (SELECT only)',
  {
    sql: { type: 'string', description: 'SQL SELECT query' },
    params: { type: 'array', items: { type: 'string' } },
  },
  async ({ sql, params }) => {
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      throw new Error('Only SELECT queries are allowed');
    }
    const result = await pool.query(sql, params || []);
    return {
      content: [{ type: 'text', text: JSON.stringify(result.rows, null, 2) }],
    };
  }
);

server.tool(
  'describe',
  'Describe database schema',
  {},
  async () => {
    const tables = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    return {
      content: [{ type: 'text', text: JSON.stringify(tables.rows, null, 2) }],
    };
  }
);

server.tool(
  'search_vectors',
  'Semantic search using embeddings',
  {
    query: { type: 'string' },
    limit: { type: 'number', default: 10 },
  },
  async ({ query, limit }) => {
    // Generate embedding and search
    const { generateEmbedding } = await import('./generate-embeddings.js');
    const embedding = await generateEmbedding(query);
    const result = await pool.query(
      `SELECT p.name, pe.content, 1 - (pe.embedding <=> $1::vector) AS similarity
       FROM product_embeddings pe
       JOIN products p ON p.id = pe.product_id
       ORDER BY pe.embedding <=> $1::vector
       LIMIT $2`,
      [`[${embedding.join(',')}]`, limit]
    );
    return {
      content: [{ type: 'text', text: JSON.stringify(result.rows, null, 2) }],
    };
  }
);

server.start();
```

### MCP Config for Claude Desktop

Letak file config:

| OS | Path |
|----|------|
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

### MCP Config for Cursor

Bikin file `.cursor/mcp.json` di root project:

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": ["path/to/mcp-db-server.js"],
      "env": {
        "AI_DATABASE_URL": "postgresql://ai_agent:password@localhost:5432/your_db"
      }
    }
  }
}
```

---

## 6. Security Patterns

### Read-Only by Default

```sql
-- PostgreSQL: create read-only role
CREATE ROLE ai_readonly;
GRANT CONNECT ON DATABASE your_db TO ai_readonly;
GRANT USAGE ON SCHEMA public TO ai_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_readonly;

CREATE USER ai_agent WITH PASSWORD 'secure_pass' IN ROLE ai_readonly;

-- Block DDL
REVOKE CREATE ON SCHEMA public FROM ai_readonly;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM ai_readonly;
```

### Row-Level Security (RLS) untuk Multi-Tenant

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY ai_agent_select ON products
  FOR SELECT
  TO ai_readonly
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Set di sesi AI
SET app.tenant_id = 'tenant-uuid-here';
```

### Rate Limiting via Proxy

```bash
# PgBouncer dengan query routing
# Atau gunakan: https://github.com/pramenkov/pgai-limiter
```

### Query Validation Layer

```javascript
// Middleware untuk filter query AI
const BLOCKED_KEYWORDS = [
  'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE',
  'INSERT', 'UPDATE', 'GRANT', 'REVOKE',
];

function validateQuery(sql) {
  const upper = sql.trim().toUpperCase();

  // Harus SELECT
  if (!upper.startsWith('SELECT')) {
    throw new Error('Only SELECT queries allowed');
  }

  // Cek blocked keywords (kecuali di string literal)
  const clean = sql.replace(/'[^']*'/g, '');
  for (const kw of BLOCKED_KEYWORDS) {
    const re = new RegExp(`\\b${kw}\\b`, 'i');
    if (re.test(clean) && kw !== 'SELECT') {
      throw new Error(`Blocked keyword: ${kw}`);
    }
  }

  // Limit wajib
  if (!/\bLIMIT\b/i.test(sql)) {
    sql += ' LIMIT 1000';
  }

  return sql;
}
```

---

## 7. Migration & Versioning

### Prisma (Recommended untuk AI Schema)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id            Int       @id @default(autoincrement())
  name          String
  price         Float
  categoryId    Int
  category      Category  @relation(fields: [categoryId], references: [id])
  reviews       Review[]
  aiDescription String?   @map("ai_description")

  // Auto-embedding generation
  embedding     Unsupported("vector(1536)")?
  createdAt     DateTime  @default(now()) @map("created_at")

  @@map("products")
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String
  products Product[]

  @@map("categories")
}

model Review {
  id        Int      @id @default(autoincrement())
  rating    Int
  productId Int
  product   Product  @relation(fields: [productId], references: [id])

  @@map("reviews")
}
```

### Alembic (Python)

```python
# migrations/versions/001_add_ai_views.py
"""add ai-friendly views

Revision ID: 001
"""

from alembic import op

def upgrade():
    op.execute("""
        CREATE VIEW ai_products AS
        SELECT
            p.id,
            p.name,
            p.price,
            c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
    """)

def downgrade():
    op.execute("DROP VIEW IF EXISTS ai_products")
```

---

## 8. Monitoring AI Queries

### Log Semua Query AI

```sql
-- PostgreSQL: log all queries from ai_agent
ALTER SYSTEM SET log_statement = 'mod';
SELECT pg_reload_conf();

-- Atau pake pg_stat_statements
CREATE EXTENSION pg_stat_statements;

SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  rows
FROM pg_stat_statements
WHERE user = 'ai_agent'
ORDER BY total_exec_time DESC
LIMIT 20;
```

### Slow Query Alert

```sql
-- Cek query > 5 detik
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - pg_stat_activity.query_start > interval '5 seconds'
  AND usename = 'ai_agent';
```

### Dashboard Sederhana

```javascript
// scripts/monitor.js
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function checkAIUsage() {
  const { rows } = await pool.query(`
    SELECT
      date_trunc('hour', query_start) AS hour,
      COUNT(*) AS queries,
      AVG(EXTRACT(EPOCH FROM (now() - query_start))) AS avg_duration
    FROM pg_stat_activity
    WHERE usename = 'ai_agent'
      AND query_start > now() - interval '24 hours'
    GROUP BY hour
    ORDER BY hour
  `);
  console.table(rows);
}

setInterval(checkAIUsage, 60000);
```

---

## 9. Quickstart Templates

### PostgreSQL + MCP — 5 Menit

```bash
# 1. Setup user
psql -U postgres -c "CREATE USER ai_agent WITH PASSWORD 'ai_pass'";
psql -U postgres -d your_db -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_agent";

# 2. Start MCP
npx -y @anthropic/mcp-postgres "postgresql://ai_agent:ai_pass@localhost:5432/your_db"
```

### SQLite + MCP — 3 Menit

```bash
# 1. Buat DB
sqlite3 data.db < schema.sql

# 2. WAL + read-only
sqlite3 data.db "PRAGMA journal_mode=WAL;"
attrib +R data.db

# 3. Start MCP
npx -y @anthropic/mcp-sqlite --db-path ./data.db
```

### Full-Stack AI Database (Node.js)

```bash
# 1. Clone template
git clone https://github.com/anthropics/mcp-quickstart
cd mcp-quickstart

# 2. Setup
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL

# 3. Generate embeddings for existing data
node scripts/generate-embeddings.js

# 4. Run MCP server
node server.js
```

---

## 10. Anti-Patterns

| Anti-Pattern | Kenapa Bahaya | Ganti Dengan |
|---|---|---|
| AI pake root/postgres user | Bisa drop database | Dedicated read-only user |
| Ga pake LIMIT | AI return 10 juta rows | Default LIMIT 100-1000 |
| Query tanpa timeout | Query gantung slama-lamanya | `statement_timeout` 15-30s |
| No connection pooling | Koneksi abis, DB crash | pg-pool / SQLAlchemy pool |
| Direct write access | AI bisa hapus data | Read-only role + audit log |
| No schema docs | AI nebak-nebak nama kolom | `ai_description` di tiap tabel |
| Embeddings di app code | Repetitif, gak konsisten | Bikin view + trigger otomatis |
| Satu DB untuk semua | Risk spreading | Pisahkan AI-dedicated replica |
| MCP tanpa validasi | AI execute query berbahaya | Query validation layer |
| Ga pake EXPLAIN | Query lambat gak ketahuan | Explain wajib sebelum deploy |

## 11. MCP Server — Skill Connect

db-mcp skill punya MCP server sendiri di `index.js`. Tools yang tersedia:

| Tool | Fungsi |
|------|--------|
| `setup_readonly_user` | Generate SQL bikin read-only user buat AI |
| `generate_mcp_config` | Generate MCP config JSON buat DB lo + client |
| `create_ai_views` | Generate SQL view AI-friendly dari tabel lo |
| `setup_vector_search` | Generate config vector embedding + similarity search |
| `validate_connection` | Validasi syntax connection string |
| `audit_schema` | Audit schema buat AI-readiness |
| `quickstart` | Generate 5-menit quickstart guide |

### Cara Connect

**Claude Desktop** — tambahin ke `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "db-mcp": {
      "command": "node",
      "args": ["C:\\Users\\Adham Baarigh\\.agents\\skills\\db-mcp\\index.js"]
    }
  }
}
```

**Cursor** — bikin `.cursor/mcp.json` di root project:

```json
{
  "mcpServers": {
    "db-mcp": {
      "command": "node",
      "args": ["C:\\Users\\Adham Baarigh\\.agents\\skills\\db-mcp\\index.js"]
    }
  }
}
```

**VS Code (Cline/Continue)** — tambahin ke config MCP tools:

```json
{
  "mcpServers": {
    "db-mcp": {
      "command": "node",
      "args": ["C:\\Users\\Adham Baarigh\\.agents\\skills\\db-mcp\\index.js"]
    }
  }
}
```

Template config udah tersedia di:

| File | Untuk |
|------|-------|
| `templates/mcp-claude-desktop.json` | Claude Desktop |
| `templates/mcp-cursor.json` | Cursor |
| `templates/mcp-postgres.json` | PostgreSQL langsung ke DB |
| `templates/mcp-sqlite.json` | SQLite langsung ke DB |
| `templates/env.example` | Environment variables |

### Test Koneksi

```bash
# Langsung test via CLI
node C:\Users\Adham Baarigh\.agents\skills\db-mcp\index.js

# Atau pake MCP inspector
npx @modelcontextprotocol/inspector node C:\Users\Adham Baarigh\.agents\skills\db-mcp\index.js
```

## Referensi

- [Model Context Protocol — Anthropic](https://modelcontextprotocol.io)
- [pgvector — PostgreSQL Vector Extension](https://github.com/pgvector/pgvector)
- [sqlite-vec — SQLite Vector Search](https://github.com/asg017/sqlite-vec)
- [Supabase AI & Vectors Guide](https://supabase.com/docs/guides/ai)
- [Prisma ORM](https://www.prisma.io)
- [PgBouncer Connection Pooling](https://www.pgbouncer.org)
