import express from "express";
import cors from "cors";
import { createClient } from "@libsql/client";

const app = express();
app.use(cors());
app.use(express.json());

const client = createClient({
  url: "libsql://cleaners-zoiriscleaningservices-sys.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQ5NzgxMDUsImlkIjoiYmJlN2YwNzMtYjZjZC00YzdhLTg4ZTgtODcwOTMxMGIyNmVlIiwicmlkIjoiYzIxYmNjMDctNWY0YS00ZjFmLWIyY2QtM2ZmNjVkYjAzMzdhIn0.qKZOylQThS32KcW9vZahDBJPASZXnjXJz1yIUavL2z75Ts0HJeJ0kdsXBUVYcMVNr1EJYWTaXwHKBX4td-Y_Cg"
});

// Initialize table
await client.execute(`
  CREATE TABLE IF NOT EXISTS cleaners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    city TEXT,
    phone TEXT,
    email TEXT,
    price TEXT,
    experience TEXT,
    desc TEXT,
    profile TEXT DEFAULT '',
    photos TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Get all cleaners
app.get("/cleaners", async (req, res) => {
  const result = await client.execute("SELECT * FROM cleaners ORDER BY id DESC");
  res.json(result.rows);
});

// Add a cleaner
app.post("/cleaners", async (req, res) => {
  const { name, city, phone, email, price, experience, desc, profile, photos } = req.body;
  await client.execute({
    sql: `INSERT INTO cleaners (name, city, phone, email, price, experience, desc, profile, photos)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [name, city, phone, email, price, experience, desc, profile || '', JSON.stringify(photos || [])]
  });
  res.json({ success: true });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
