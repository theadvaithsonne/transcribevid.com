-- The whole database: the random code each open page made up, and the time of its last ping. Rows older than the active
-- window are deleted by a scheduled job every 5 minutes (src/index.ts), so nothing stays long after the visitors left.
CREATE TABLE IF NOT EXISTS seen (code TEXT PRIMARY KEY, t INTEGER NOT NULL);
