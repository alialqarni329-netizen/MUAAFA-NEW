import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';

interface LoadingViewProps {
  color?: string;
  message?: string;
}

/**
 * Full-screen centered loading indicator.
 */
export function LoadingView({ color = Colors.primary, message }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  message: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});
