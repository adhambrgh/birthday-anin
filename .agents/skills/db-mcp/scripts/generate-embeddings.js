// generate-embeddings.js — Generate embeddings untuk semua record di DB
// Usage: node generate-embeddings.js [table_name]

import pg from 'pg';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function getEmbedding(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000), // OpenAI limit
  });
  return res.data[0].embedding;
}

async function generateForTable(tableName) {
  console.log(`Generating embeddings for ${tableName}...`);

  // Get columns
  const { rows: columns } = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position
  `, [tableName]);

  const textColumns = columns.filter(c =>
    ['text', 'varchar', 'char', 'name'].includes(c.data_type)
  );

  // Get records without embeddings
  const { rows: records } = await pool.query(`
    SELECT id, ${textColumns.map(c => `"${c.column_name}"`).join(', ')}
    FROM "${tableName}"
    WHERE embedding IS NULL
    LIMIT 500
  `);

  for (const record of records) {
    const text = textColumns
      .map(c => `${c.column_name}: ${record[c.column_name]}`)
      .join('\n');

    if (!text.trim()) continue;

    const embedding = await getEmbedding(text);
    await pool.query(
      `UPDATE "${tableName}" SET embedding = $1 WHERE id = $2`,
      [`[${embedding.join(',')}]`, record.id]
    );
    console.log(`  ✅ ID ${record.id} done`);
  }

  console.log(`Done: ${records.length} records processed`);
}

const tableName = process.argv[2];
if (!tableName) {
  console.log('Usage: node generate-embeddings.js <table_name>');
  process.exit(1);
}

generateForTable(tableName).catch(console.error).finally(() => pool.end());
