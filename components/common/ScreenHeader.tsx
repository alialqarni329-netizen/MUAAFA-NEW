import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Background color (defaults to portal color or white) */
  color?: string;
  /** If true, renders a back arrow on the right (RTL) */
  showBack?: boolean;
  /** Optional right-side action button */
  action?: React.ReactNode;
}

/**
 * Reusable top header used across all portal screens.
 * Handles safe-area top padding and RTL layout.
 */
export function ScreenHeader({
  title,
  subtitle,
  color = Colors.white,
  showBack = false,
  action,
}: ScreenHeaderProps) {
  const isDark = color !== Colors.white && color !== Colors.background;

  return (
    <View style={[styles.header, { backgroundColor: color }]}>
      <View style={styles.row}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowRight size={22} color={isDark ? '#fff' : Colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{subtitle}</Text>
          ) : null}
        </View>
        {action ? <View>{action}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  titleDark: { color: '#fff' },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  subtitleDark: { color: 'rgba(255,255,255,0.8)' },
});
