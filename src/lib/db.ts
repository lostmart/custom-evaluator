import Database from "better-sqlite3"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(path.join(dataDir, "evaluator.db"))

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT    NOT NULL,
    email     TEXT    NOT NULL,
    name      TEXT    NOT NULL,
    event     TEXT    NOT NULL,
    detail    TEXT    NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    submitted_at TEXT    NOT NULL,
    email        TEXT    NOT NULL,
    name         TEXT    NOT NULL,
    answers      TEXT    NOT NULL,
    score        INTEGER NOT NULL
  );
`)

export default db
