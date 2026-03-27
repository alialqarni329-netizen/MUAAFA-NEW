/**
 * Push notifications hook.
 * All native API calls are individually wrapped in try-catch to prevent ObjC
 * exceptions from propagating through the TurboModule bridge (EXC_BAD_ACCESS).
 */
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@lib/supabase';

// Foreground notification appearance — wrapped to prevent crash on unsupported OS versions
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch {
  console.warn('[useNotifications] setNotificationHandler failed');
}

/**
 * Requests permission and retrieves the Expo push token.
 * Each native call is individually guarded — one failure does not block the rest.
 */
async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Simulator / emulator has no push token
  if (!Device.isDevice) return null;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    // Android: notification channel setup — wrapped separately so iOS flow is unaffected
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'الإشعارات العامة',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0ea5e9',
        });
      } catch {
        console.warn('[useNotifications] Android channel setup failed');
      }
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData?.data ?? null;
  } catch {
    console.warn('[useNotifications] registerForPushNotificationsAsync failed');
    return null;
  }
}

interface UseNotificationsOptions {
  /** Called when the user taps a notification. */
  onNotificationTapped?: (notification: Notifications.Notification) => void;
}

export function useNotifications({ onNotificationTapped }: UseNotificationsOptions = {}) {
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // Register push token and persist to Supabase — fully non-fatal
    const setupPush = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (!token) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('users')
          .update({ push_token: token })
          .eq('id', user.id);
      } catch {
        console.warn('[useNotifications] push setup failed');
      }
    };

    setupPush();

    // Listener registration wrapped individually — prevents crash if native module fails
    try {
      notificationListener.current = Notifications.addNotificationReceivedListener(
        notification => {
          console.log('[useNotifications] received:', notification.request.identifier);
        },
      );
    } catch {
      console.warn('[useNotifications] addNotificationReceivedListener failed');
    }

    try {
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        response => { onNotificationTapped?.(response.notification); },
      );
    } catch {
      console.warn('[useNotifications] addNotificationResponseReceivedListener failed');
    }

    return () => {
      try { notificationListener.current?.remove(); } catch { /* no-op */ }
      try { responseListener.current?.remove(); } catch { /* no-op */ }
    };
  }, [onNotificationTapped]);
}
