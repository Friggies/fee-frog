import { View, Text, StyleSheet, Image } from 'react-native';

export function EmptyState() {
  return (
    <View style={styles.empty}>
      <Image
        source={require('../assets/logo.png')}
        style={{ width: 100, height: 100, resizeMode: 'contain' }}
      />
      <Text style={styles.emptyText}>No subscriptions yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { color: '#9fb0d6' },
  addBtnSmall: {
    marginTop: 8,
    backgroundColor: '#1f2a58',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: { color: '#d4e7ff', fontWeight: '700' },
});
