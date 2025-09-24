import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getSubscriptionById } from '@/db/subscriptions';
import { useAppState } from '@/store/AppState';
import { SubscriptionForm } from '@/components/SubscriptionForm';
import { colors } from '@/theme/colors';
import { parseFlexibleNumber } from '@/utils/format';

type FormState = { name: string; price: string; billingDate: string };

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const { add, update, remove } = useAppState();

  const [form, setForm] = useState<FormState>({
    name: '',
    price: '',
    billingDate: '',
  });

  useEffect(() => {
    (async () => {
      if (id) {
        const row = await getSubscriptionById(db, Number(id));
        if (!row) {
          Alert.alert('Not found', 'This subscription no longer exists.');
          router.back();
          return;
        }
        setForm({
          name: row.name ?? '',
          price: String(row.price ?? ''),
          billingDate: row.billingDate ?? '',
        });
      }
    })();
  }, [db, id, router]);

  const onChange = useCallback(
    (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch })),
    [],
  );

  const onSave = useCallback(async () => {
    if (!form.name.trim()) {
      Alert.alert('Name is required');
      return;
    }

    const day = form.billingDate.trim();
    if (day !== '') {
      const n = Number(day);
      if (!Number.isInteger(n) || n < 1 || n > 31) {
        Alert.alert('Billing day must be between 1 and 31');
        return;
      }
    }

    const numericPrice = parseFlexibleNumber(form.price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      Alert.alert('Enter a valid price (e.g., 7.99 or 7,99)');
      return;
    }

    if (id) {
      await update({
        id: Number(id),
        name: form.name.trim(),
        price: numericPrice,
        billingDate: form.billingDate.trim() || null,
      });
    } else {
      await add({
        name: form.name.trim(),
        price: numericPrice,
        billingDate: form.billingDate.trim() || null,
      });
    }
    router.back();
  }, [add, update, form, id, router]);

  const onDelete = useCallback(() => {
    if (!id) return;
    Alert.alert(
      'Delete subscription',
      `Delete "${form.name || 'this subscription'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await remove(Number(id));
            router.back();
          },
        },
      ],
    );
  }, [form.name, id, remove, router]);

  return (
    <View style={styles.container}>
      <SubscriptionForm
        values={form}
        onChange={onChange}
        onSave={onSave}
        mode={id ? 'edit' : 'add'}
        onDelete={id ? onDelete : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
});
