import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '@lib/supabase';
import { resolveUserPortal, isEmailConfirmed, PORTAL_HOME } from '@lib/authGuard';
import { ErrorBoundary } from '@components/common';
import { useNotifications } from '@hooks/useNotifications';
import { ThemeProvider } from '../contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

// Maximum time (ms) to wait for Supabase session check before redirecting to welcome.
// Prevents the user from being stuck on a blank screen if the network is slow.
const BOOTSTRAP_TIMEOUT_MS = 8000;

export default function RootLayout() {
  // Register push token and set up notification listeners app-wide.
  useNotifications();

  useEffect(() => {
    // ── Initial session check ──────────────────────────────────────────────
    // Redirect returning users to their correct portal without showing the
    // welcome screen. A timeout ensures we never leave the user on a blank screen.
    const bootstrap = async () => {
      // Safety timeout — if Supabase takes too long, send user to welcome
      const timeoutId = setTimeout(() => {
        console.warn('[bootstrap] Supabase session check timed out, redirecting to welcome');
        router.replace('/(auth)/welcome' as never);
        SplashScreen.hideAsync();
      }, BOOTSTRAP_TIMEOUT_MS);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        clearTimeout(timeoutId);

        if (session?.user) {
          // Block unconfirmed emails — send back to OTP screen
          if (!isEmailConfirmed(session.user)) {
            const encodedEmail = encodeURIComponent(session.user.email ?? '');
            router.replace(`/(auth)/otp?email=${encodedEmail}&type=signup` as never);
          } else {
            const portal = await resolveUserPortal(session.user.id);
            router.replace(PORTAL_HOME[portal] as never);
          }
        } else {
          router.replace('/(auth)/welcome' as never);
        }
      } catch {
        clearTimeout(timeoutId);
        console.warn('[bootstrap] Session check failed, redirecting to welcome');
        router.replace('/(auth)/welcome' as never);
      } finally {
        SplashScreen.hideAsync();
      }
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
          // Block unconfirmed emails — keep on OTP screen until verified
          if (!isEmailConfirmed(session.user)) {
            const encodedEmail = encodeURIComponent(session.user.email ?? '');
            router.replace(`/(auth)/otp?email=${encodedEmail}&type=signup` as never);
            return;
          }
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
