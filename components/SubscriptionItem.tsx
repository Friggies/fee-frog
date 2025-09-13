import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { colors } from '@/theme/colors';
import { formatAmount, renewsLabel } from '@/utils/format';

type Item = {
  id: number;
  name: string;
  price: number;
  billingDate?: string | null;
};

export function SubscriptionRow({
  item,
  currency,
  onPress,
  onDelete,
}: {
  item: Item;
  currency: string;
  onPress: () => void;
  onDelete: () => void;
}) {
  const renderRightActions = () => (
    <Pressable onPress={onDelete} style={styles.deleteAction}>
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  const label = renewsLabel(item.billingDate);

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable onPress={onPress} style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          {label && <Text style={styles.meta}>{label}</Text>}
        </View>
        <Text style={styles.price}>
          {formatAmount(item.price || 0, currency)}/mo
        </Text>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
  },
  name: { color: '#fff', fontSize: 16, fontWeight: '600' },
  meta: { color: colors.muted, marginTop: 2, fontSize: 12 },
  price: { color: '#fff', fontWeight: '700', marginLeft: 12 },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    backgroundColor: '#d33',
    marginVertical: 2,
    borderRadius: 12,
  },
  deleteText: { color: '#fff', fontWeight: '700' },
});
