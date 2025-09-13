import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDbIfNeeded } from '@/db/schema';
import { AppStateProvider } from '@/store/AppState';
import { View, StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName='fee-frog.db' onInit={migrateDbIfNeeded}>
        <AppStateProvider>
          <View style={{ flex: 1, backgroundColor: '#0b1020' }}>
            <StatusBar barStyle='light-content' />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: '#0b1020' },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
              }}
            >
              <Stack.Screen name='index' options={{ title: 'Subscriptions' }} />
              <Stack.Screen name='edit' options={{ title: 'Subscription' }} />
              {/* Modal group */}
              <Stack.Screen
                name='(modals)/settings'
                options={{ title: 'Settings', presentation: 'modal' }}
              />
            </Stack>
          </View>
        </AppStateProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
