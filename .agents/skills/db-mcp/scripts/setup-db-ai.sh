#!/bin/bash
# setup-db-ai.sh — Setup database untuk AI + MCP
# Usage: ./setup-db-ai.sh <postgres|sqlite|mysql|mongodb>

set -euo pipefail

DB_TYPE="${1:-postgres}"
DB_NAME="${2:-ai_db}"
AI_USER="${3:-ai_agent}"
AI_PASS="${4:-$(openssl rand -base64 16)}"

echo "=== DB-MCP: Setup $DB_TYPE untuk AI ==="

case "$DB_TYPE" in
  postgres)
    echo "Creating PostgreSQL user: $AI_USER"
    psql -U postgres -c "CREATE ROLE ai_readonly;"
    psql -U postgres -c "GRANT CONNECT ON DATABASE $DB_NAME TO ai_readonly;"
    psql -U postgres -c "GRANT USAGE ON SCHEMA public TO ai_readonly;"
    psql -U postgres -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_readonly;"
    psql -U postgres -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_readonly;"
    psql -U postgres -c "CREATE USER $AI_USER WITH PASSWORD '$AI_PASS' IN ROLE ai_readonly;"
    psql -U postgres -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS vector;"
    echo "PostgreSQL AI user: $AI_USER / $AI_PASS"
    ;;

  sqlite)
    echo "Creating SQLite database: $DB_NAME.db"
    sqlite3 "$DB_NAME.db" "PRAGMA journal_mode=WAL;"
    sqlite3 "$DB_NAME.db" "PRAGMA synchronous=NORMAL;"
    echo "Database created: $DB_NAME.db"
    echo "To make read-only: chmod 444 $DB_NAME.db"
    ;;

  mysql)
    echo "Creating MySQL user: $AI_USER"
    mysql -u root -e "CREATE USER '$AI_USER'@'%' IDENTIFIED BY '$AI_PASS';"
    mysql -u root -e "GRANT SELECT ON $DB_NAME.* TO '$AI_USER'@'%';"
    mysql -u root -e "FLUSH PRIVILEGES;"
    echo "MySQL AI user: $AI_USER / $AI_PASS"
    ;;

  mongodb)
    echo "Creating MongoDB user: $AI_USER"
    mongosh "$DB_NAME" --eval "
      db.createUser({
        user: '$AI_USER',
        pwd: '$AI_PASS',
        roles: [{ role: 'read', db: '$DB_NAME' }]
      });
    "
    echo "MongoDB AI user: $AI_USER / $AI_PASS"
    ;;

  *)
    echo "Unknown DB type: $DB_TYPE"
    echo "Usage: ./setup-db-ai.sh <postgres|sqlite|mysql|mongodb> [db_name] [username]"
    exit 1
    ;;
esac

echo ""
echo "=== MCP Config Template ==="
echo "Add this to your claude_desktop_config.json:"
echo ""
case "$DB_TYPE" in
  postgres)
    echo '{
  "mcpServers": {
    "'$DB_TYPE'": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-postgres",
        "postgresql://'$AI_USER':'$AI_PASS'@localhost:5432/'$DB_NAME'"
      ]
    }
  }
}'
    ;;
  sqlite)
    echo '{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-sqlite",
        "--db-path", "./'$DB_NAME'.db"
      ]
    }
  }
}'
    ;;
  mysql)
    echo '{
  "mcpServers": {
    "mysql": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-mysql",
        "mysql://'$AI_USER':'$AI_PASS'@localhost:3306/'$DB_NAME'"
      ]
    }
  }
}'
    ;;
  mongodb)
    echo '{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-mongodb",
        "mongodb://'$AI_USER':'$AI_PASS'@localhost:27017/'$DB_NAME'"
      ]
    }
  }
}'
    ;;
esac
