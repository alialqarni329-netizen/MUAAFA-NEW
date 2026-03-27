/**
 * Push notifications hook.
 * Handles permission request, token registration, and incoming notification listeners.
 * Call this once from the root layout (or individual portal layout) after the user is authenticated.
 */
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@lib/supabase';

// How foreground notifications should appear
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Requests permission, retrieves the Expo push token, and saves it to the
 * `users` table so the backend can send targeted pushes.
 */
async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    // Push tokens are not available in emulators.
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  // Android requires an explicit notification channel.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'الإشعارات العامة',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0ea5e9',
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

interface UseNotificationsOptions {
  /** Called when the user taps a notification. */
  onNotificationTapped?: (notification: Notifications.Notification) => void;
}

export function useNotifications({ onNotificationTapped }: UseNotificationsOptions = {}) {
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // Register push token and persist to Supabase
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
      } catch (err) {
        // Non-fatal — app works fine without push tokens.
        console.warn('[useNotifications] push setup failed:', err);
      }
    };

    setupPush();

    // Listen for notifications received while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('[useNotifications] received:', notification);
      },
    );

    // Listen for user tapping a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        onNotificationTapped?.(response.notification);
      },
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [onNotificationTapped]);
}
