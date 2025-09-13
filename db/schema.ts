import type { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  try {
    await db.execAsync('PRAGMA journal_mode = WAL;');
  } catch {}

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL DEFAULT 0,
      billingDate TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_subs_name ON subscriptions(name);

    CREATE TABLE IF NOT EXISTS prefs (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);
}
