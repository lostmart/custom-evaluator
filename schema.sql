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
