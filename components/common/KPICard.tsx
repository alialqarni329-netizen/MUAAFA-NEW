import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  /** Optional percentage trend — positive = up, negative = down */
  trend?: number;
  /** Optional subtitle line below the label */
  sub?: string;
}

export function KPICard({ label, value, icon, color, trend, sub }: KPICardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: color }]}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub != null ? <Text style={styles.sub}>{sub}</Text> : null}
      {trend !== undefined && (
        <View style={styles.trendRow}>
          {trend >= 0
            ? <ArrowUpRight size={12} color={Colors.success} />
            : <ArrowDownRight size={12} color={Colors.error} />}
          <Text style={[styles.trendText, { color: trend >= 0 ? Colors.success : Colors.error }]}>
            {Math.abs(trend)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (Layout.window.width - 34) / 2,
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg,
    padding: 14,
    ...Layout.shadow.sm,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.semibold,
  },
});
