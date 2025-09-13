import type { SQLiteDatabase } from 'expo-sqlite';

export type NewSub = {
  name: string;
  price: number;
  billingDate: string | null;
};
export type SubRow = {
  id: number;
  name: string;
  price: number;
  billingDate: string | null;
  createdAt: string;
};

export async function getAllSubscriptions(
  db: SQLiteDatabase,
): Promise<SubRow[]> {
  return await db.getAllAsync<SubRow>(`SELECT id, name, price, billingDate, createdAt
                                       FROM subscriptions
                                       ORDER BY createdAt DESC;`);
}

export async function getSubscriptionById(
  db: SQLiteDatabase,
  id: number,
): Promise<SubRow | null> {
  const row = await db.getFirstAsync<SubRow>(
    `SELECT id, name, price, billingDate, createdAt FROM subscriptions WHERE id = ?`,
    [id],
  );
  return row ?? null;
}

export async function insertSubscription(
  db: SQLiteDatabase,
  sub: NewSub,
): Promise<number> {
  const res = await db.runAsync(
    `INSERT INTO subscriptions (name, price, billingDate) VALUES (?, ?, ?)`,
    [sub.name, sub.price, sub.billingDate],
  );
  return Number(res.lastInsertRowId);
}

export async function updateSubscription(
  db: SQLiteDatabase,
  sub: { id: number } & NewSub,
): Promise<void> {
  await db.runAsync(
    `UPDATE subscriptions SET name = ?, price = ?, billingDate = ? WHERE id = ?`,
    [sub.name, sub.price, sub.billingDate, sub.id],
  );
}

export async function removeSubscription(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(`DELETE FROM subscriptions WHERE id = ?`, [id]);
}
