import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export function TotalHeader({ totalLabel }: { totalLabel: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.subtitle}>Monthly total</Text>
      <Text style={styles.total}>{totalLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  total: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 2 },
});
