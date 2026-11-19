CREATE TABLE demo_suggestions (
  topic TEXT PRIMARY KEY NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  last_requested_at TEXT NOT NULL
);
