import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import {
  getAllSubscriptions,
  getSubscriptionById,
  insertSubscription,
  updateSubscription as dbUpdate,
  removeSubscription as dbRemove,
  type SubRow,
  type NewSub,
} from '@/db/subscriptions';
import { getPref, setPref } from '@/db/prefs';

type State = {
  subscriptions: SubRow[];
  currency: string;
};
type Ctx = State & {
  refresh: () => Promise<void>;
  add: (sub: NewSub) => Promise<void>;
  update: (sub: { id: number } & NewSub) => Promise<void>;
  remove: (id: number) => Promise<void>;
  setCurrency: (valuta: string) => Promise<void>;
};

const AppStateContext = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [subscriptions, setSubscriptions] = useState<SubRow[]>([]);
  const [currency, setCurrencyState] = useState<string>('$');

  const refresh = async () => {
    const [rows, savedCurrency] = await Promise.all([
      getAllSubscriptions(db),
      getPref(db, 'currency'),
    ]);
    setSubscriptions(rows);
    setCurrencyState(savedCurrency ?? '$');
  };

  useEffect(() => {
    refresh();
  }, [db]);

  const add = async (sub: NewSub) => {
    const id = await insertSubscription(db, sub);
    const row = await getSubscriptionById(db, id);
    if (row) setSubscriptions((prev) => [row, ...prev]);
  };

  const update = async (sub: { id: number } & NewSub) => {
    await dbUpdate(db, sub);
    const row = await getSubscriptionById(db, sub.id);
    if (row)
      setSubscriptions((prev) => prev.map((s) => (s.id === sub.id ? row : s)));
  };

  const remove = async (id: number) => {
    await dbRemove(db, id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const setCurrency = async (valuta: string) => {
    await setPref(db, 'currency', valuta);
    setCurrencyState(valuta);
  };

  const value = useMemo<Ctx>(
    () => ({
      subscriptions,
      currency,
      refresh,
      add,
      update,
      remove,
      setCurrency,
    }),
    [subscriptions, currency],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): Ctx {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
