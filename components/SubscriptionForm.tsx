import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '@/theme/colors';

export function SubscriptionForm({
  values,
  onChange,
  onSave,
  mode,
  onDelete,
}: {
  values: { name: string; price: string; billingDate: string };
  onChange: (patch: Partial<typeof values>) => void;
  onSave: () => void;
  mode: 'add' | 'edit';
  onDelete?: () => void;
}) {
  const clampDay = (t: string) => {
    const digits = t.replace(/\D/g, '');
    if (digits.length === 0) return '';
    let n = parseInt(digits.slice(0, 2), 10);
    if (Number.isNaN(n)) return '';
    if (n < 1) n = 1;
    if (n > 31) n = 31;
    return String(n);
  };

  return (
    <View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={values.name}
        onChangeText={(t) => onChange({ name: t })}
        placeholder='Netflix'
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        autoCapitalize='words'
      />

      <Text style={styles.label}>Monthly price</Text>
      <TextInput
        value={values.price}
        onChangeText={(t) => onChange({ price: t })}
        placeholder='7.99'
        placeholderTextColor={colors.placeholder}
        keyboardType='decimal-pad'
        style={styles.input}
      />

      <Text style={styles.label}>Billing day (optional)</Text>
      <TextInput
        value={values.billingDate}
        onChangeText={(t) => onChange({ billingDate: clampDay(t) })}
        onEndEditing={(e) =>
          onChange({ billingDate: clampDay(e.nativeEvent.text) })
        }
        placeholder='31'
        placeholderTextColor={colors.placeholder}
        keyboardType='number-pad'
        maxLength={2}
        style={styles.input}
      />

      <Pressable onPress={onSave} style={styles.primaryBtn}>
        <Text style={styles.btnText}>
          {mode === 'edit' ? 'Update subscription' : 'Add subscription'}
        </Text>
      </Pressable>

      {mode === 'edit' && onDelete && (
        <Pressable onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.btnText}>Delete subscription</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#9fb0d6',
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: '#3a4b8fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  btnText: { color: '#fff', fontWeight: '700' },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: '#8f3a3aff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
