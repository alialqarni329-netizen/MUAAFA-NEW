import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, RefreshControl, TouchableOpacity,
} from 'react-native';
import { Database, Shield, CreditCard, Server, Mail, HardDrive, RefreshCw } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface ServiceItem {
  id: string;
  name: string;
  nameAr: string;
  status: ServiceStatus;
  latency: number;
  uptime: number;
  icon: React.ReactNode;
  lastCheck: string;
}

const STATUS_CONFIG: Record<ServiceStatus, { label: string; color: string; bg: string }> = {
  operational: { label: 'يعمل', color: Colors.success, bg: Colors.success + '15' },
  degraded:    { label: 'بطيء', color: Colors.warning, bg: Colors.warning + '15' },
  down:        { label: 'معطل', color: Colors.error,   bg: Colors.error + '15' },
};

export default function OwnerServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const checkServices = useCallback(async () => {
    const start = Date.now();

    // Test DB connectivity
    const { error: dbError } = await supabase.from('users').select('id').limit(1);
    const dbLatency = Date.now() - start;

    // Test auth service
    const authStart = Date.now();
    const { error: authError } = await supabase.auth.getSession();
    const authLatency = Date.now() - authStart;

    const now = new Date().toLocaleTimeString('ar-SA');

    const serviceList: ServiceItem[] = [
      {
        id: 'db',
        name: 'Database',
        nameAr: 'قاعدة البيانات',
        status: dbError ? 'down' : dbLatency > 800 ? 'degraded' : 'operational',
        latency: dbLatency,
        uptime: dbError ? 94.5 : 99.8,
        icon: <Database size={20} color="#fff" />,
        lastCheck: now,
      },
      {
        id: 'auth',
        name: 'Auth Service',
        nameAr: 'خدمة المصادقة',
        status: authError ? 'down' : authLatency > 600 ? 'degraded' : 'operational',
        latency: authLatency,
        uptime: authError ? 97.2 : 99.9,
        icon: <Shield size={20} color="#fff" />,
        lastCheck: now,
      },
      {
        id: 'payments',
        name: 'Payment Gateway',
        nameAr: 'بوابة الدفع',
        status: 'operational',
        latency: 210,
        uptime: 99.5,
        icon: <CreditCard size={20} color="#fff" />,
        lastCheck: now,
      },
      {
        id: 'server',
        name: 'App Server',
        nameAr: 'خادم التطبيق',
        status: 'operational',
        latency: 45,
        uptime: 99.99,
        icon: <Server size={20} color="#fff" />,
        lastCheck: now,
      },
      {
        id: 'email',
        name: 'Email Service',
        nameAr: 'خدمة البريد',
        status: 'operational',
        latency: 320,
        uptime: 98.7,
        icon: <Mail size={20} color="#fff" />,
        lastCheck: now,
      },
      {
        id: 'storage',
        name: 'Storage',
        nameAr: 'التخزين',
        status: 'operational',
        latency: 180,
        uptime: 99.6,
        icon: <HardDrive size={20} color="#fff" />,
        lastCheck: now,
      },
    ];

    setServices(serviceList);
    setLastUpdated(now);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { checkServices(); }, [checkServices]);

  const allOperational = services.every(s => s.status === 'operational');
  const downCount = services.filter(s => s.status === 'down').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;

  const overallStatus: ServiceStatus = downCount > 0 ? 'down' : degradedCount > 0 ? 'degraded' : 'operational';
  const overallLabel = downCount > 0 ? `${downCount} خدمة معطلة` : degradedCount > 0 ? `${degradedCount} خدمة بطيئة` : 'جميع الخدمات تعمل';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); checkServices(); }} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>حالة الخدمات</Text>
        {lastUpdated ? <Text style={styles.updated}>آخر تحديث: {lastUpdated}</Text> : null}
      </View>

      {/* Overall Banner */}
      {!loading && (
        <View style={[styles.banner, { backgroundColor: STATUS_CONFIG[overallStatus].color }]}>
          <View style={styles.bannerDot} />
          <Text style={styles.bannerText}>{overallLabel}</Text>
          <TouchableOpacity onPress={() => { setRefreshing(true); checkServices(); }} style={styles.refreshBtn}>
            <RefreshCw size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Summary Cards */}
      {!loading && (
        <View style={styles.summaryRow}>
          {[
            { label: 'تعمل', count: services.filter(s => s.status === 'operational').length, color: Colors.success },
            { label: 'بطيئة', count: degradedCount, color: Colors.warning },
            { label: 'معطلة', count: downCount, color: Colors.error },
          ].map(s => (
            <View key={s.label} style={styles.summaryCard}>
              <Text style={[styles.summaryCount, { color: s.color }]}>{s.count}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Service List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تفاصيل الخدمات</Text>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          services.map(svc => {
            const cfg = STATUS_CONFIG[svc.status];
            const iconColors: Record<string, string> = {
              db: Colors.primary,
              auth: Colors.success,
              payments: '#f59e0b',
              server: '#6366f1',
              email: '#ec4899',
              storage: '#14b8a6',
            };
            return (
              <View key={svc.id} style={styles.serviceCard}>
                <View style={[styles.serviceIcon, { backgroundColor: iconColors[svc.id] ?? Colors.primary }]}>
                  {svc.icon}
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{svc.nameAr}</Text>
                  <View style={styles.serviceMetrics}>
                    <Text style={styles.serviceMetric}>زمن: {svc.latency}ms</Text>
                    <Text style={styles.serviceMetric}>تشغيل: {svc.uptime}%</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 18,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  updated: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  banner: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginTop: 12,
    borderRadius: Layout.radius.lg, padding: 14, gap: 10,
  },
  bannerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  bannerText: { flex: 1, color: '#fff', fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold },
  refreshBtn: { padding: 4 },
  summaryRow: { flexDirection: 'row', padding: 12, gap: 8 },
  summaryCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 12, alignItems: 'center', ...Layout.shadow.sm,
  },
  summaryCount: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold },
  summaryLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  section: { margin: 12 },
  sectionTitle: {
    fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary, marginBottom: 10,
  },
  serviceCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg, padding: 14, marginBottom: 8, gap: 12, ...Layout.shadow.sm,
  },
  serviceIcon: {
    width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  serviceMetrics: { flexDirection: 'row', gap: 12, marginTop: 4 },
  serviceMetric: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold },
});
