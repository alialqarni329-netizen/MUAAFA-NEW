import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface StatusBadgeProps {
  label: string;
  color: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

export function StatusBadge({ label, color, icon, compact = false }: StatusBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        compact ? styles.compact : styles.normal,
        { backgroundColor: color + '15' },
      ]}
    >
      {icon ?? null}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Layout.radius.full,
    alignSelf: 'flex-start',
  },
  normal: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
});
