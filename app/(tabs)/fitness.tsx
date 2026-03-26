import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Activity, Heart, Footprints, Flame, TrendingUp, Plus } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface HealthScan {
  id: string;
  steps?: number;
  heart_rate?: number;
  calories_burned?: number;
  sleep_hours?: number;
  water_intake_ml?: number;
  scan_date: string;
  notes?: string;
}

interface MetricCard {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
}

export default function FitnessScreen() {
  const [todayScan, setTodayScan] = useState<HealthScan | null>(null);
  const [history, setHistory] = useState<HealthScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];

    const { data: todayData } = await supabase
      .from('health_scans')
      .select('*')
      .eq('user_id', user.id)
      .gte('scan_date', today)
      .maybeSingle();

    const { data: histData } = await supabase
      .from('health_scans')
      .select('*')
      .eq('user_id', user.id)
      .order('scan_date', { ascending: false })
      .limit(7);

    setTodayScan(todayData as HealthScan | null);
    setHistory((histData ?? []) as HealthScan[]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const metrics: MetricCard[] = todayScan
    ? [
        {
          label: 'الخطوات',
          value: (todayScan.steps ?? 0).toLocaleString('ar'),
          unit: 'خطوة',
          icon: <Footprints size={22} color="#fff" />,
          color: Colors.primary,
          progress: Math.min((todayScan.steps ?? 0) / 10000, 1),
        },
        {
          label: 'ضربات القلب',
          value: String(todayScan.heart_rate ?? '--'),
          unit: 'نبضة/د',
          icon: <Heart size={22} color="#fff" />,
          color: Colors.error,
          progress: Math.min((todayScan.heart_rate ?? 70) / 150, 1),
        },
        {
          label: 'السعرات',
          value: (todayScan.calories_burned ?? 0).toLocaleString('ar'),
          unit: 'سعرة',
          icon: <Flame size={22} color="#fff" />,
          color: Colors.warning,
          progress: Math.min((todayScan.calories_burned ?? 0) / 2000, 1),
        },
        {
          label: 'النوم',
          value: String(todayScan.sleep_hours ?? '--'),
          unit: 'ساعة',
          icon: <Activity size={22} color="#fff" />,
          color: Colors.success,
          progress: Math.min((todayScan.sleep_hours ?? 0) / 8, 1),
        },
      ]
    : [];

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1, marginTop: 100 }} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>لياقتي اليوم</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.logBtn}>
          <Plus size={18} color="#fff" />
          <Text style={styles.logBtnText}>تسجيل</Text>
        </TouchableOpacity>
      </View>

      {todayScan ? (
        <View style={styles.metricsGrid}>
          {metrics.map((m, i) => (
            <View key={i} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: m.color }]}>{m.icon}</View>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricUnit}>{m.unit}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${m.progress * 100}%` as unknown as number, backgroundColor: m.color }]} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noDataCard}>
          <Activity size={48} color={Colors.textMuted} />
          <Text style={styles.noDataText}>لم تسجل بيانات اليوم بعد</Text>
          <TouchableOpacity style={styles.startBtn}>
            <Text style={styles.startBtnText}>ابدأ التتبع</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Weekly History */}
      {history.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>السجل الأسبوعي</Text>
          </View>
          {history.map(scan => (
            <View key={scan.id} style={styles.historyRow}>
              <Text style={styles.historyDate}>
                {new Date(scan.scan_date).toLocaleDateString('ar-SA', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
              <View style={styles.historyMetrics}>
                <Text style={styles.historyMetric}>{(scan.steps ?? 0).toLocaleString('ar')} خطوة</Text>
                <Text style={styles.historyMetric}>{scan.calories_burned ?? 0} سعرة</Text>
                <Text style={styles.historyMetric}>{scan.sleep_hours ?? 0} ساعة نوم</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 50,
    paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  headerDate: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  logBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Layout.radius.full,
  },
  logBtnText: { color: '#fff', fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold },
  metricsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10,
  },
  metricCard: {
    width: (Layout.window.width - 34) / 2,
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 14, alignItems: 'center', ...Layout.shadow.sm,
  },
  metricIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  metricValue: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  metricUnit: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  metricLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  progressBar: {
    width: '100%', height: 4, backgroundColor: Colors.divider, borderRadius: 2, marginTop: 8, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  noDataCard: {
    margin: 12, backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 32, alignItems: 'center', gap: 12, ...Layout.shadow.sm,
  },
  noDataText: { fontSize: Typography.fontSize.md, color: Colors.textMuted },
  startBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: Layout.radius.full,
  },
  startBtnText: { color: '#fff', fontWeight: Typography.fontWeight.semibold },
  historySection: { margin: 12, marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10,
  },
  sectionTitle: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  historyRow: {
    backgroundColor: Colors.white, borderRadius: Layout.radius.md, padding: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 6, ...Layout.shadow.sm,
  },
  historyDate: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.medium, color: Colors.textPrimary },
  historyMetrics: { gap: 2, alignItems: 'flex-end' },
  historyMetric: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
});
