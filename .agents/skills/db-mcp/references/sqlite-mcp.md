# SQLite — MCP Setup Lengkap

## 1. Setup DB

```bash
# Install
winget install sqlite  # Windows
brew install sqlite    # macOS
sudo apt install sqlite3  # Linux

# Create DB
sqlite3 data.db

# WAL mode (important for concurrent reads)
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA busy_timeout=5000;
```

## 2. Read-Only Mode

```bash
# Windows: set file read-only
attrib +R data.db

# Linux/macOS
chmod 444 data.db

# Connect read-only
sqlite3 file:data.db?mode=ro
```

## 3. sqlite-vec (Embeddings)

```bash
# Download extension from https://github.com/asg017/sqlite-vec/releases
# Place .dll/.so/.dylib in project folder
```

```sql
.load ./vec0

CREATE VIRTUAL TABLE vec_items USING vec0(
  embedding float[1536] distance_metric=cosine
);
```

## 4. MCP Config

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-sqlite",
        "--db-path", "./data.db"
      ]
    }
  }
}
```

## 5. Best Practices

- Keep DB file < 10GB untuk performa
- Gunakan WAL mode (dramatis ngebaca lebih cepat)
- Bikin index di kolom yang sering di-query AI
- Jangan pake SQLite untuk concurrent write dari AI — read-only aja
