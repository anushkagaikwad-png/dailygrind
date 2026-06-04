const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Anushkag31.!",   // <-- change this
  database: "daily_tracker",
  waitForConnections: true,
  connectionLimit: 10,
});

// GET all logs
app.get("/api/logs", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM daily_logs ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create log
app.post("/api/logs", async (req, res) => {
  const { date, dsa_questions, core_subject, core_hours, development_hours, sleep_hours, notes } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO daily_logs (date, dsa_questions, core_subject, core_hours, development_hours, sleep_hours, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         dsa_questions=VALUES(dsa_questions), core_subject=VALUES(core_subject),
         core_hours=VALUES(core_hours), development_hours=VALUES(development_hours),
         sleep_hours=VALUES(sleep_hours), notes=VALUES(notes)`,
      [date, dsa_questions || 0, core_subject, core_hours || 0, development_hours || 0, sleep_hours || 0, notes || ""]
    );
    const [rows] = await pool.query("SELECT * FROM daily_logs WHERE id = ?", [result.insertId || result.insertId]);
    res.json(rows[0] || { message: "updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update log
app.put("/api/logs/:id", async (req, res) => {
  const { date, dsa_questions, core_subject, core_hours, development_hours, sleep_hours, notes } = req.body;
  try {
    await pool.query(
      `UPDATE daily_logs SET date=?, dsa_questions=?, core_subject=?, core_hours=?, development_hours=?, sleep_hours=?, notes=? WHERE id=?`,
      [date, dsa_questions || 0, core_subject, core_hours || 0, development_hours || 0, sleep_hours || 0, notes || "", req.params.id]
    );
    res.json({ message: "updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE log
app.delete("/api/logs/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM daily_logs WHERE id = ?", [req.params.id]);
    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
