import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'db-mcp',
  version: '1.0.0',
  description: 'Setup, configure, and manage any database for AI + MCP — PostgreSQL, SQLite, MySQL, SQL Server, MongoDB. Generate read-only users, AI views, vector embeddings, connection strings, and ready-to-use MCP configs.',
}, {
  capabilities: { tools: { listChanged: false } },
});

// ─── Tool 1: Setup Read-Only User ────────────────────────────────────────────

const SQL_TEMPLATES = {
  postgres: (user, pass, db) => [
    `CREATE ROLE ai_readonly;`,
    `GRANT CONNECT ON DATABASE "${db}" TO ai_readonly;`,
    `GRANT USAGE ON SCHEMA public TO ai_readonly;`,
    `GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_readonly;`,
    `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_readonly;`,
    `REVOKE CREATE ON SCHEMA public FROM ai_readonly;`,
    `CREATE USER ${user} WITH PASSWORD '${pass}' IN ROLE ai_readonly;`,
  ],
  mysql: (user, pass, db) => [
    `CREATE USER '${user}'@'%' IDENTIFIED BY '${pass}';`,
    `GRANT SELECT ON ${db}.* TO '${user}'@'%';`,
    `REVOKE DROP, ALTER, CREATE, INSERT, UPDATE, DELETE ON ${db}.* FROM '${user}'@'%';`,
    `FLUSH PRIVILEGES;`,
  ],
  sqlserver: (user, pass, db) => [
    `CREATE LOGIN ${user} WITH PASSWORD = '${pass}';`,
    `USE ${db};`,
    `CREATE USER ${user} FOR LOGIN ${user};`,
    `ALTER ROLE db_datareader ADD MEMBER ${user};`,
  ],
  mongodb: (user, pass, db) => [
    `use ${db};`,
    `db.createUser({ user: "${user}", pwd: "${pass}", roles: [{ role: "read", db: "${db}" }] });`,
  ],
};

server.tool(
  'setup_readonly_user',
  'Generate SQL/commands to create a read-only database user for AI agents. Returns commands for the specified database type.',
  {
    db_type: z.enum(['postgres', 'mysql', 'sqlserver', 'mongodb']).describe('Database type'),
    username: z.string().default('ai_agent').describe('Username for the AI agent'),
    password: z.string().describe('Strong password for the AI agent'),
    database: z.string().describe('Database name to grant access to'),
  },
  async ({ db_type, username, password, database }) => {
    const template = SQL_TEMPLATES[db_type];
    if (!template) throw new Error(`Unsupported database type: ${db_type}`);
    const commands = template(username, password, database);

    let output = `/* === Setup Read-Only User for ${db_type} === */\n`;
    output += `Database: ${database}\n`;
    output += `User: ${username}\n\n`;
    output += commands.join('\n');
    output += `\n\n/* === Connection String === */\n`;
    output += getConnectionString(db_type, username, password, 'localhost', 5432, database);

    return { content: [{ type: 'text', text: output }] };
  }
);

// ─── Tool 2: Generate MCP Config ─────────────────────────────────────────────

function getConnectionString(type, user, pass, host, port, db) {
  const map = {
    postgres: `postgresql://${user}:${pass}@${host}:${port}/${db}?sslmode=require`,
    mysql: `mysql://${user}:${pass}@${host}:${port}/${db}?ssl-mode=REQUIRED`,
    sqlserver: `sqlserver://${user}:${pass}@${host}:${port};database=${db};encrypt=true`,
    mongodb: `mongodb://${user}:${pass}@${host}:27017/${db}?ssl=true`,
    sqlite: `sqlite:///${db}.db?mode=ro`,
  };
  return map[type] || 'connection string not available';
}

function getMcpCommand(dbType, connectionString) {
  const cmds = {
    postgres: {
      command: 'npx',
      args: ['-y', '@anthropic/mcp-postgres', connectionString],
    },
    sqlite: {
      command: 'npx',
      args: ['-y', '@anthropic/mcp-sqlite', '--db-path', connectionString.replace('sqlite:///', '').replace('?mode=ro', '')],
    },
    mysql: {
      command: 'npx',
      args: ['-y', '@anthropic/mcp-mysql', connectionString],
    },
  };
  return cmds[dbType] || null;
}

const MCP_CLIENT_PATHS = {
  'claude-desktop': {
    windows: '%APPDATA%\\Claude\\claude_desktop_config.json',
    macos: '~/Library/Application Support/Claude/claude_desktop_config.json',
    linux: '~/.config/Claude/claude_desktop_config.json',
  },
  cursor: {
    path: '.cursor/mcp.json',
    desc: 'Create in your project root',
  },
  'vs-code': {
    path: '.vscode/mcp.json',
    desc: 'Or configure in VS Code settings',
  },
};

server.tool(
  'generate_mcp_config',
  'Generate ready-to-use MCP configuration JSON for any database + client (Claude Desktop, Cursor, VS Code).',
  {
    db_type: z.enum(['postgres', 'sqlite', 'mysql']).describe('Database type to connect'),
    connection_string: z.string().describe('Full database connection string'),
    client: z.enum(['claude-desktop', 'cursor', 'vs-code']).default('claude-desktop').describe('Target MCP client'),
    server_name: z.string().default('database').describe('Custom name for this MCP server'),
  },
  async ({ db_type, connection_string, client, server_name }) => {
    const mcpEntry = getMcpCommand(db_type, connection_string);
    if (!mcpEntry) throw new Error(`No MCP server available for ${db_type} yet`);

    const config = { mcpServers: { [server_name]: mcpEntry } };
    const clientInfo = MCP_CLIENT_PATHS[client];
    let output = `/* === MCP Config for ${client} === */\n`;
    output += `Database: ${db_type}\n\n`;
    output += JSON.stringify(config, null, 2);
    output += `\n\n/* === Save Location === */\n`;
    if (clientInfo.path) {
      output += `${clientInfo.path}${clientInfo.desc ? '\n' + clientInfo.desc : ''}`;
    } else {
      output += clientInfo.windows + '\n' + clientInfo.macos + '\n' + clientInfo.linux;
    }
    output += `\n\n/* === Connection String (for reference) === */\n${connection_string}`;

    return { content: [{ type: 'text', text: output }] };
  }
);

// ─── Tool 3: Create AI Views ─────────────────────────────────────────────────

server.tool(
  'create_ai_views',
  'Generate SQL to create AI-friendly views for a given table — flattens joins, renames ambiguous columns, adds context.',
  {
    db_type: z.enum(['postgres', 'mysql', 'sqlserver']).default('postgres').describe('Database type'),
    table_name: z.string().describe('Main table name'),
    columns: z.array(z.object({
      name: z.string(),
      type: z.string(),
    })).describe('Column definitions'),
    joins: z.array(z.object({
      table: z.string(),
      column: z.string(),
      ref_table: z.string(),
      ref_column: z.string(),
      select_columns: z.array(z.string()).describe('Columns to include from joined table'),
    })).optional().describe('Foreign key relationships to flatten'),
  },
  async ({ db_type, table_name, columns, joins }) => {
    let selectColumns = columns
      .filter(c => !['id', 'created_at', 'updated_at', 'deleted_at'].includes(c.name))
      .map(c => `  ${c.name === 'id' ? `${table_name}.${c.name} AS ${table_name}_id` : `${table_name}.${c.name}`}`);

    const joinClauses = [];
    (joins || []).forEach(j => {
      j.select_columns.forEach(col => {
        selectColumns.push(`  ${j.table}.${col} AS ${j.table}_${col}`);
      });
      joinClauses.push(`LEFT JOIN ${j.table} ON ${j.table}.${j.column} = ${j.ref_table}.${j.ref_column}`);
    });

    const sql = `CREATE VIEW ai_${table_name} AS\nSELECT\n${selectColumns.join(',\n')}\nFROM ${table_name}\n${joinClauses.join('\n')};`;

    let output = `/* === AI-Friendly View: ai_${table_name} === */\n`;
    output += `/* Flattens joins, renames columns with prefixes, ready for AI consumption */\n\n`;
    output += sql;
    output += `\n\n/* === Usage === */\n`;
    output += `SELECT * FROM ai_${table_name} LIMIT 100;`;

    return { content: [{ type: 'text', text: output }] };
  }
);

// ─── Tool 4: Vector Search Setup ─────────────────────────────────────────────

server.tool(
  'setup_vector_search',
  'Generate SQL/config for vector embeddings & similarity search on any supported database.',
  {
    db_type: z.enum(['postgres', 'sqlite']).default('postgres').describe('Database type'),
    table_name: z.string().default('documents').describe('Table to add vector search to'),
    dimensions: z.number().default(1536).describe('Embedding dimensions (1536 for OpenAI text-embedding-3-small, 768 for text-embedding-3-large, 384 for all-MiniLM-L6-v2)'),
    distance: z.enum(['cosine', 'l2', 'inner_product']).default('cosine').describe('Distance metric for similarity search'),
  },
  async ({ db_type, table_name, dimensions, distance }) => {
    const ops = { cosine: 'vector_cosine_ops', l2: 'vector_l2_ops', inner_product: 'vector_ip_ops' };
    const op = ops[distance];

    let output = '';
    if (db_type === 'postgres') {
      output = `/* === pgvector Setup for ${table_name} === */\n\n`;
      output += `-- 1. Install extension\nCREATE EXTENSION IF NOT EXISTS vector;\n\n`;
      output += `-- 2. Add embedding column\nALTER TABLE ${table_name} ADD COLUMN embedding VECTOR(${dimensions});\n\n`;
      output += `-- 3. Create index for similarity search\n`;
      output += `CREATE INDEX ON ${table_name} USING ivfflat (embedding ${op}) WITH (lists = 100);\n\n`;
      output += `-- 4. Search query\n`;
      output += `SELECT *, 1 - (embedding <=> '[0.001, 0.002, ...]'::vector) AS similarity\n`;
      output += `FROM ${table_name}\nORDER BY embedding <=> '[0.001, 0.002, ...]'::vector\nLIMIT 10;\n\n`;
      output += `-- 5. Generate embeddings (Node.js)\n`;
      output += `import OpenAI from 'openai';\n`;
      output += `const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });\n`;
      output += `const res = await openai.embeddings.create({\n`;
      output += `  model: 'text-embedding-3-small',\n`;
      output += `  input: 'your text here',\n`;
      output += `});\n`;
      output += `const embedding = res.data[0].embedding;\n`;
    } else {
      output = `/* === sqlite-vec Setup for ${table_name} === */\n\n`;
      output += `-- 1. Load extension\n.load ./vec0\n\n`;
      output += `-- 2. Create virtual table\n`;
      output += `CREATE VIRTUAL TABLE vec_${table_name} USING vec0(\n`;
      output += `  embedding float[${dimensions}] distance_metric=${distance}\n);\n\n`;
      output += `-- 3. Insert data\n`;
      output += `INSERT INTO vec_${table_name}(rowid, embedding)\n`;
      output += `  SELECT id, embedding FROM ${table_name};\n\n`;
      output += `-- 4. Search\n`;
      output += `SELECT rowid, distance\nFROM vec_${table_name}\nWHERE embedding MATCH '[0.001, ...]'\n  AND k = 10;\n`;
    }

    return { content: [{ type: 'text', text: output }] };
  }
);

// ─── Tool 5: Validate Connection ─────────────────────────────────────────────

server.tool(
  'validate_connection',
  'Check if a database connection string is well-formed and return diagnostic info. Does NOT actually connect — validates syntax only.',
  {
    connection_string: z.string().describe('Database connection string to validate'),
  },
  async ({ connection_string }) => {
    const protocols = {
      postgresql: 'PostgreSQL',
      postgres: 'PostgreSQL',
      mysql: 'MySQL/MariaDB',
      sqlserver: 'SQL Server',
      mongodb: 'MongoDB',
      sqlite: 'SQLite',
    };

    const parsed = new URL(connection_string);
    const dbType = protocols[parsed.protocol.replace(':', '')];
    const issues = [];

    if (!dbType) issues.push('Unknown protocol. Supported: postgresql://, mysql://, sqlserver://, mongodb://, sqlite://');
    if (!parsed.hostname || parsed.hostname === 'localhost') issues.push('Warning: using localhost — not accessible from remote MCP clients');
    if (!parsed.username) issues.push('Missing username');
    if (!parsed.password) issues.push('Missing password');
    if (parsed.protocol !== 'sqlite:' && !parsed.pathname?.slice(1)) issues.push('Missing database name');

    const output = `/* === Connection Validation === */\n`;
    const valid = issues.length === 0 || issues.every(i => i.startsWith('Warning'));
    const status = valid ? '✅ VALID' : '❌ INVALID';

    return {
      content: [{
        type: 'text',
        text: `${output}Status: ${status}\nType: ${dbType || 'Unknown'}\nHost: ${parsed.hostname || 'N/A'}\nDatabase: ${parsed.pathname?.slice(1) || parsed.hostname || 'N/A'}\nUser: ${parsed.username || 'N/A'}\n${issues.length ? '\nIssues:\n' + issues.map(i => '  ⚠️  ' + i).join('\n') : ''}`,
      }],
    };
  }
);

// ─── Tool 6: Audit Schema AI-Readiness ───────────────────────────────────────

server.tool(
  'audit_schema',
  'Analyze database schema definitions and flag issues for AI consumption — missing descriptions, bad naming, missing indexes, no LIMIT patterns.',
  {
    columns: z.array(z.object({
      name: z.string(),
      type: z.string(),
      nullable: z.boolean().optional(),
      isPrimaryKey: z.boolean().optional(),
    })).describe('Column definitions to audit'),
    table_name: z.string().describe('Table name being audited'),
  },
  async ({ columns, table_name }) => {
    const issues = [];

    columns.forEach(col => {
      if (/^[a-z]_[a-z0-9]+$/.test(col.name) && col.name.length < 5) {
        issues.push({ severity: 'warning', message: `Column "${col.name}" uses cryptic short prefix — AI might not understand it`, fix: 'Rename to full descriptive name' });
      }
      if (/[A-Z]/.test(col.name[0])) {
        issues.push({ severity: 'error', message: `Column "${col.name}" starts with uppercase — use snake_case for AI clarity`, fix: `Rename to ${col.name.replace(/[A-Z]/g, c => '_' + c.toLowerCase()).replace(/^_/, '')}` });
      }
      if (!col.nullable && col.type === 'text') {
        issues.push({ severity: 'info', message: `Column "${col.name}" is NOT NULL text — consider allowing NULL for missing AI descriptions`, fix: 'ALTER TABLE ... ALTER COLUMN ... DROP NOT NULL' });
      }
    });

    if (!columns.some(c => c.name === 'created_at' || c.name === 'createdAt')) {
      issues.push({ severity: 'info', message: 'Missing timestamp column — AI benefits from temporal context', fix: 'Add created_at TIMESTAMP DEFAULT NOW()' });
    }
    if (!columns.some(c => c.name === 'ai_description' || c.name === 'description')) {
      issues.push({ severity: 'info', message: `No ai_description column — AI-friendly context column recommended`, fix: `ALTER TABLE ${table_name} ADD COLUMN ai_description TEXT;` });
    }
    if (!columns.some(c => c.name === 'embedding')) {
      issues.push({ severity: 'info', message: 'No embedding column — vector search not available', fix: `Add VECTOR column for semantic search` });
    }
    if (issues.length === 0) {
      issues.push({ severity: 'success', message: 'Schema looks AI-ready!' });
    }

    let output = `/* === Schema Audit: ${table_name} === */\n\n`;
    issues.forEach((iss, i) => {
      const icon = iss.severity === 'error' ? '🔴' : iss.severity === 'warning' ? '🟡' : iss.severity === 'info' ? '🔵' : '✅';
      output += `${icon} [${iss.severity.toUpperCase()}] ${iss.message}\n`;
      if (iss.fix) output += `   Fix: ${iss.fix}\n`;
      output += '\n';
    });

    output += `/* === AI View Recommendation === */\n`;
    output += `Run the "create_ai_views" tool to generate: ai_${table_name}`;

    return { content: [{ type: 'text', text: output }] };
  }
);

// ─── Tool 7: Quickstart Template ─────────────────────────────────────────────

server.tool(
  'quickstart',
  'Generate a complete quickstart guide for setting up a database for AI + MCP in under 5 minutes.',
  {
    db_type: z.enum(['postgres', 'sqlite', 'mysql']).default('postgres').describe('Database type'),
    db_name: z.string().default('ai_db').describe('Database name'),
    username: z.string().default('ai_agent').describe('AI agent username'),
  },
  async ({ db_type, db_name, username }) => {
    const password = 'ai_' + Math.random().toString(36).slice(2, 10);
    const connStr = getConnectionString(db_type, username, password, 'localhost', db_type === 'postgres' ? 5432 : 3306, db_name);

    const steps = {
      postgres: [
        { cmd: `psql -U postgres -c "CREATE USER ${username} WITH PASSWORD '${password}';"`, desc: 'Create user' },
        { cmd: `psql -U postgres -d ${db_name} -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${username};"`, desc: 'Grant read-only' },
        { cmd: `psql -U postgres -d ${db_name} -c "CREATE EXTENSION IF NOT EXISTS vector;"`, desc: 'Enable vector support' },
        { cmd: `npx -y @anthropic/mcp-postgres "${connStr}"`, desc: 'Start MCP server' },
      ],
      sqlite: [
        { cmd: `sqlite3 ${db_name}.db "PRAGMA journal_mode=WAL;"`, desc: 'Create DB + WAL mode' },
        { cmd: `sqlite3 ${db_name}.db "PRAGMA synchronous=NORMAL;"`, desc: 'Optimize for reads' },
        { cmd: `attrib +R ${db_name}.db`, desc: 'Make read-only (Windows)' },
        { cmd: `npx -y @anthropic/mcp-sqlite --db-path ./${db_name}.db`, desc: 'Start MCP server' },
      ],
      mysql: [
        { cmd: `mysql -u root -e "CREATE USER '${username}'@'%' IDENTIFIED BY '${password}';"`, desc: 'Create user' },
        { cmd: `mysql -u root -e "GRANT SELECT ON ${db_name}.* TO '${username}'@'%'; FLUSH PRIVILEGES;"`, desc: 'Grant read-only' },
        { cmd: `npx -y @anthropic/mcp-mysql "${connStr}"`, desc: 'Start MCP server' },
      ],
    };

    let output = `/* === Quickstart: ${db_type} → AI + MCP === */\n`;
    output += `Estimated time: 5 minutes\n\n`;
    output += `Connection string: ${connStr}\n`;
    output += `Password: ${password} (save this!)\n\n`;
    output += `Steps:\n`;
    steps[db_type].forEach((s, i) => {
      output += `\n${i + 1}. ${s.desc}\n   $ ${s.cmd}`;
    });
    output += `\n\n/* === Claude Desktop Config === */\n`;
    output += `Add to claude_desktop_config.json:\n`;
    output += JSON.stringify({ mcpServers: { [db_type]: getMcpCommand(db_type, connStr) } }, null, 2);

    return { content: [{ type: 'text', text: output }] };
  }
);

// ─── Start Server ────────────────────────────────────────────────────────────

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('db-mcp MCP server running on stdio');
  } catch (error) {
    console.error('Failed to start db-mcp MCP server:', error);
    process.exit(1);
  }
}

main();
