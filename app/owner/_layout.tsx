import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { supabase } from '@lib/supabase';
import { resolveUserPortal } from '@lib/authGuard';
import { Colors } from '@constants/colors';

export default function OwnerLayout() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const guard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/(auth)/welcome' as never);
        return;
      }
      const portal = await resolveUserPortal(session.user.id);
      if (portal !== 'owner') {
        // Not an owner — redirect to their correct portal.
        if (portal === 'business') router.replace('/business/(tabs)' as never);
        else router.replace('/(tabs)' as never);
        return;
      }
      setChecking(false);
    };
    guard();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.owner} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="users" />
      <Stack.Screen name="business-mgmt" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
