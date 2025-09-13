import { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '@/store/AppState';
import { SubscriptionRow } from '@/components/SubscriptionItem';
import { TotalHeader } from '@/components/TotalHeader';
import { AddButton } from '@/components/AddButton';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/format';

type SortBy = 'upcoming' | 'price';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { subscriptions, currency, remove } = useAppState();
  const [sortBy, setSortBy] = useState<SortBy>('price');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => router.push('/(modals)/settings')}
          hitSlop={10}
          style={{ paddingHorizontal: 12 }}
        >
          <Ionicons name='settings-outline' size={22} color='#fff' />
        </Pressable>
      ),
    });
  }, [navigation, router]);

  const total = useMemo(
    () => subscriptions.reduce((sum, s) => sum + (Number(s.price) || 0), 0),
    [subscriptions],
  );

  const TODAY_DAY = new Date().getDate();
  const ROLLING_WINDOW = 31;

  const toDaysUntil = (s: { billingDate?: string | null }) => {
    const day = Number(s.billingDate);
    if (!Number.isInteger(day) || day < 1 || day > 31)
      return Number.POSITIVE_INFINITY;

    const diff = day - TODAY_DAY;
    return diff >= 0 ? diff : diff + ROLLING_WINDOW;
  };

  const sorted = useMemo(() => {
    const arr = [...subscriptions];
    if (sortBy === 'upcoming') {
      arr.sort((a, b) => {
        const da = toDaysUntil(a);
        const db = toDaysUntil(b);
        if (da !== db) return da - db;
        const priceTie = (Number(b.price) || 0) - (Number(a.price) || 0);
        if (priceTie !== 0) return priceTie;
        return a.name.localeCompare(b.name);
      });
    } else {
      arr.sort((a, b) => {
        const p = (Number(b.price) || 0) - (Number(a.price) || 0);
        if (p !== 0) return p;
        return toDaysUntil(a) - toDaysUntil(b);
      });
    }
    return arr;
  }, [subscriptions, sortBy]);

  const onDelete = (id: number, name: string) => {
    Alert.alert('Delete subscription', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <TotalHeader totalLabel={formatAmount(total, currency)} />

      <View style={styles.sortBar}>
        <Pressable
          onPress={() => setSortBy('price')}
          style={[styles.chip, sortBy === 'price' && styles.chipActive]}
        >
          <Ionicons
            name='cash-outline'
            size={14}
            color={sortBy === 'price' ? '#0b1020' : '#d4e7ff'}
          />
          <Text
            style={[
              styles.chipText,
              sortBy === 'price' && styles.chipTextActive,
            ]}
          >
            Most expensive
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setSortBy('upcoming')}
          style={[styles.chip, sortBy === 'upcoming' && styles.chipActive]}
        >
          <Ionicons
            name='calendar-outline'
            size={14}
            color={sortBy === 'upcoming' ? '#0b1020' : '#d4e7ff'}
          />
          <Text
            style={[
              styles.chipText,
              sortBy === 'upcoming' && styles.chipTextActive,
            ]}
          >
            Upcoming
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <SubscriptionRow
            item={item}
            currency={currency}
            onPress={() =>
              router.push({
                pathname: '/edit',
                params: { id: String(item.id) },
              })
            }
            onDelete={() => onDelete(item.id, item.name)}
          />
        )}
        ListFooterComponent={<AddButton onPress={() => router.push('/edit')} />}
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sortBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#1a2146',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: {
    backgroundColor: '#90e0ef',
    borderColor: '#90e0ef',
  },
  chipText: {
    color: '#d4e7ff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: '#0b1020',
  },
});
