import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '@lib/supabase';
import { resolveUserPortal, PORTAL_HOME } from '@lib/authGuard';
import { ErrorBoundary } from '@components/common';
import { useNotifications } from '@hooks/useNotifications';
import { ThemeProvider } from '../contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Register push token and set up notification listeners app-wide.
  useNotifications();

  useEffect(() => {
    // ── Initial session check ──────────────────────────────────────────────
    // Redirect returning users to their correct portal without showing the
    // welcome screen.
    const bootstrap = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const portal = await resolveUserPortal(session.user.id);
        router.replace(PORTAL_HOME[portal] as never);
      } else {
        router.replace('/(auth)/welcome' as never);
      }
      SplashScreen.hideAsync();
    };

    bootstrap();

    // ── Auth state listener ────────────────────────────────────────────────
    // Handles sign-in (routes to correct portal) and sign-out (back to auth).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.replace('/(auth)/welcome' as never);
          return;
        }
        if (event === 'SIGNED_IN' && session.user) {
          const portal = await resolveUserPortal(session.user.id);
          router.replace(PORTAL_HOME[portal] as never);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider>
    <ErrorBoundary>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="business" />
        <Stack.Screen name="owner" />
      </Stack>
    </ErrorBoundary>
    </ThemeProvider>
  );
}
