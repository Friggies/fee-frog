import { Pressable, Text, StyleSheet } from 'react-native';

export function AddButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.addBtn}>
      <Text style={styles.addBtnText}>Add subscription</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    marginTop: 12,
    backgroundColor: '#3a4b8fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
});
