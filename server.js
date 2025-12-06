import express from "express";
import cors from "cors";
import { createClient } from "@libsql/client";

const app = express();
app.use(cors());
app.use(express.json());

const client = createClient({
  url: "libsql://cleaners-zoiriscleaningservices-sys.aws-us-east-1.turso.io",
  authToken: "YOUR_AUTH_TOKEN_HERE" // replace with your Turso token
});

// Initialize table
async function initDB() {
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
}
initDB();

// Get all cleaners
app.get("/cleaners", async (req, res) => {
  try {
    const result = await client.execute("SELECT * FROM cleaners ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a cleaner
app.post("/cleaners", async (req, res) => {
  try {
    const { name, city, phone, email, price, experience, desc, profile, photos } = req.body;
    await client.execute({
      sql: `INSERT INTO cleaners (name, city, phone, email, price, experience, desc, profile, photos)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [name, city, phone, email, price, experience, desc, profile || '', JSON.stringify(photos || [])]
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add service" });
  }
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
