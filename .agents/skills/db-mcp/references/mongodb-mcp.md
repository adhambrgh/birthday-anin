# MongoDB — MCP Setup Lengkap

## 1. AI User Setup

```javascript
use your_db;

db.createUser({
  user: "ai_agent",
  pwd: "secure_password",
  roles: [
    { role: "read", db: "your_db" }
  ]
});

// Optional: read-only to specific collection
db.createRole({
  role: "ai_products_read",
  privileges: [
    {
      resource: { db: "your_db", collection: "products" },
      actions: ["find", "listCollections"]
    }
  ],
  roles: []
});

db.createUser({
  user: "ai_agent_limited",
  pwd: "secure_password",
  roles: [{ role: "ai_products_read", db: "your_db" }]
});
```

## 2. Schema Validation untuk AI

```javascript
db.runCommand({
  collMod: "products",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price", "category"],
      properties: {
        name: { bsonType: "string", description: "Nama produk" },
        price: { bsonType: "number", minimum: 0 },
        category: { bsonType: "string" },
        embedding: { bsonType: "array", description: "Vector embedding" },
        ai_description: { bsonType: "string", description: "Deskripsi untuk AI" }
      }
    }
  }
});
```

## 3. Atlas Vector Search

```javascript
// Create index di Atlas UI or CLI:
// {
//   "name": "vector_index",
//   "type": "vectorSearch",
//   "fields": [{
//     "type": "vector",
//     "path": "embedding",
//     "numDimensions": 1536,
//     "similarity": "cosine"
//   }]
// }

db.products.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: [0.001, 0.002, ...],
      numCandidates: 100,
      limit: 10
    }
  },
  {
    $project: {
      name: 1,
      price: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
]);
```

## 4. MCP Config

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-mongodb",
        "mongodb://ai_agent:password@localhost:27017/your_db?ssl=true"
      ]
    }
  }
}
```
