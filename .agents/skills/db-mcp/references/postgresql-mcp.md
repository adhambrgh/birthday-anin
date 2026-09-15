# PostgreSQL — MCP Setup Lengkap

## 1. Install & Config

```bash
# Windows (via winget)
winget install PostgreSQL.PostgreSQL

# macOS
brew install postgresql@16

# Linux
sudo apt install postgresql-16
```

## 2. AI User Setup

```bash
psql -U postgres
```

```sql
-- Read-only role
CREATE ROLE ai_readonly;
GRANT CONNECT ON DATABASE your_db TO ai_readonly;
GRANT USAGE ON SCHEMA public TO ai_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_readonly;

-- User
CREATE USER ai_agent WITH PASSWORD 'your_secure_password' IN ROLE ai_readonly;
```

## 3. pgvector Setup

```sql
CREATE EXTENSION vector;

CREATE TABLE embeddings (
  id SERIAL PRIMARY KEY,
  table_name TEXT,
  row_id INTEGER,
  content TEXT,
  embedding VECTOR(1536),
  created_at TIMESTAMPDEFAULT NOW()
);

CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

## 4. MCP Config (Claude Desktop)

`%APPDATA%\Claude\claude_desktop_config.json`:
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

## 5. Bikin AI-Friendly Views

```sql
CREATE VIEW ai_orders AS
SELECT
  o.id AS order_id,
  o.total_amount,
  o.status,
  c.name AS customer_name,
  c.email AS customer_email,
  COUNT(oi.id) AS item_count
FROM orders o
JOIN customers c ON c.id = o.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, c.name, c.email;
```
