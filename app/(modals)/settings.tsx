import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { useAppState } from '@/store/AppState';
import Constants from 'expo-constants';
const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsModal() {
  const router = useRouter();
  const { currency, setCurrency } = useAppState();
  const [valuta, setValuta] = useState(currency);

  useEffect(() => setValuta(currency), [currency]);

  const onSave = useCallback(async () => {
    await setCurrency(valuta.trim() || '$');
    router.back();
  }, [router, setCurrency, valuta]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Global valuta</Text>
        <TextInput
          value={valuta}
          onChangeText={setValuta}
          placeholder='$'
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          autoCapitalize='characters'
        />
        <Text style={styles.help}>
          Use any symbol or text like: <Text style={styles.code}>$</Text>,{' '}
          <Text style={styles.code}>€</Text>,{' '}
          <Text style={styles.code}>DKK</Text>,{' '}
          <Text style={styles.code}>kr.</Text>
        </Text>

        <Pressable onPress={onSave} style={styles.primaryBtn}>
          <Text style={styles.btnText}>Update valuta</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.secondaryBtn}>
          <Text style={styles.btnText}>Close settings</Text>
        </Pressable>
      </View>

      <Text style={styles.p}>Developed by Frej Dahl Linneke</Text>

      <Text style={styles.p}>No data collection or tracking</Text>

      <Text style={styles.p}>Version: {appVersion} - 2025 &copy;</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  p: { color: colors.muted, marginBottom: 8 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  label: { color: '#9fb0d6', marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#0f1430',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  help: { color: colors.muted, fontSize: 12, marginTop: 8 },
  code: { color: '#fff' },
  primaryBtn: {
    marginTop: 14,
    backgroundColor: '#3a4b8fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  btnText: { color: '#fff', fontWeight: '800' },
  secondaryBtn: {
    marginTop: 10,
    backgroundColor: '#3a4b8fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
