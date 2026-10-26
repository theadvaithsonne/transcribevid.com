-- The whole database: one row holding one number. INTEGER PRIMARY KEY and no other index, so an increment writes one row.
CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY CHECK (id = 1), n INTEGER NOT NULL DEFAULT 0);
INSERT OR IGNORE INTO counter (id, n) VALUES (1, 0);
