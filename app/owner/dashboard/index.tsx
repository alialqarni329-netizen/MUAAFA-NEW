import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import {
  Users, Building2, DollarSign, TrendingUp,
  Activity, AlertTriangle, CheckCircle, Clock,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface OwnerStats {
  totalUsers: number;
  newUsersToday: number;
  totalBusinesses: number;
  pendingApprovals: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalSessions: number;
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date(); thisMonth.setDate(1);

    const [usersRes, bizRes, pendingRes, revRes, monthRevRes, sessRes] = await Promise.all([
      supabase.from('users').select('id, created_at', { count: 'exact' }),
      supabase.from('business_registrations').select('id', { count: 'exact' }),
      supabase.from('business_registrations').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('payment_transactions').select('amount').eq('status', 'paid'),
      supabase.from('payment_transactions').select('amount').eq('status', 'paid').gte('created_at', thisMonth.toISOString()),
      supabase.from('medical_sessions').select('id', { count: 'exact' }),
    ]);

    const users = usersRes.data ?? [];
    const newToday = users.filter(u => u.created_at?.startsWith(today)).length;
    const totalRev = (revRes.data ?? []).reduce((s, t) => s + (t.amount ?? 0), 0);
    const monthRev = (monthRevRes.data ?? []).reduce((s, t) => s + (t.amount ?? 0), 0);

    setStats({
      totalUsers: usersRes.count ?? 0,
      newUsersToday: newToday,
      totalBusinesses: bizRes.count ?? 0,
      pendingApprovals: pendingRes.count ?? 0,
      totalRevenue: totalRev,
      monthlyRevenue: monthRev,
      activeSubscriptions: 0,
      totalSessions: sessRes.count ?? 0,
    });
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.owner} style={{ flex: 1, marginTop: 100 }} />;
  }

  const kpis = stats
    ? [
        { label: 'المستخدمون', value: stats.totalUsers.toLocaleString('ar'), sub: `+${stats.newUsersToday} اليوم`, icon: <Users size={20} color="#fff" />, color: Colors.primary },
        { label: 'المنشآت', value: stats.totalBusinesses.toString(), sub: `${stats.pendingApprovals} بانتظار`, icon: <Building2 size={20} color="#fff" />, color: Colors.business },
        { label: 'إيرادات الشهر', value: `${stats.monthlyRevenue.toLocaleString('ar')} ر`, sub: `إجمالي: ${stats.totalRevenue.toLocaleString('ar')}`, icon: <DollarSign size={20} color="#fff" />, color: Colors.success },
        { label: 'الجلسات', value: stats.totalSessions.toLocaleString('ar'), sub: 'إجمالي الجلسات', icon: <Activity size={20} color="#fff" />, color: Colors.warning },
      ]
    : [];

  const quickNav = [
    { label: 'إدارة المستخدمين', path: '/owner/users', icon: <Users size={18} color={Colors.primary} />, color: Colors.primary },
    { label: 'الموافقة على المنشآت', path: '/owner/business-mgmt', icon: <Building2 size={18} color={Colors.business} />, color: Colors.business, badge: stats?.pendingApprovals },
    { label: 'التحليلات', path: '/owner/analytics', icon: <TrendingUp size={18} color={Colors.success} />, color: Colors.success },
    { label: 'المدفوعات', path: '/owner/payments', icon: <DollarSign size={18} color={Colors.warning} />, color: Colors.warning },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>لوحة تحكم المالك</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <View style={styles.ownerBadge}>
          <CheckCircle size={14} color="#fff" />
          <Text style={styles.ownerBadgeText}>مالك</Text>
        </View>
      </View>

      {/* Pending Approvals Alert */}
      {(stats?.pendingApprovals ?? 0) > 0 && (
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => router.push('/owner/business-mgmt' as never)}
        >
          <AlertTriangle size={18} color={Colors.warning} />
          <Text style={styles.alertBannerText}>
            {stats?.pendingApprovals} منشأة تنتظر الموافقة
          </Text>
          <Text style={styles.alertBannerCta}>مراجعة ←</Text>
        </TouchableOpacity>
      )}

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        {kpis.map((kpi, i) => (
          <View key={i} style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: kpi.color }]}>{kpi.icon}</View>
            <Text style={styles.kpiValue}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <Text style={styles.kpiSub}>{kpi.sub}</Text>
          </View>
        ))}
      </View>

      {/* Quick Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الأقسام الرئيسية</Text>
        <View style={styles.navList}>
          {quickNav.map(nav => (
            <TouchableOpacity
              key={nav.label}
              style={styles.navItem}
              onPress={() => router.push(nav.path as never)}
            >
              <View style={[styles.navIcon, { backgroundColor: nav.color + '15' }]}>{nav.icon}</View>
              <Text style={styles.navLabel}>{nav.label}</Text>
              {(nav.badge ?? 0) > 0 && (
                <View style={styles.navBadge}>
                  <Text style={styles.navBadgeText}>{nav.badge}</Text>
                </View>
              )}
              <Clock size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 24,
  },
  greeting: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  date: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  ownerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: Layout.radius.full },
  ownerBadgeText: { color: '#fff', fontSize: 12, fontWeight: Typography.fontWeight.semibold },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, margin: 12,
    backgroundColor: Colors.warning + '15', borderRadius: Layout.radius.lg, padding: 12,
    borderWidth: 1, borderColor: Colors.warning + '30',
  },
  alertBannerText: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  alertBannerCta: { fontSize: Typography.fontSize.sm, color: Colors.warning, fontWeight: Typography.fontWeight.semibold },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10 },
  kpiCard: { width: (Layout.window.width - 34) / 2, backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 14, ...Layout.shadow.sm },
  kpiIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  kpiValue: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  kpiLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  kpiSub: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  section: { margin: 12 },
  sectionTitle: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary, marginBottom: 10 },
  navList: { backgroundColor: Colors.white, borderRadius: Layout.radius.lg, overflow: 'hidden', ...Layout.shadow.sm },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  navIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  navLabel: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  navBadge: { backgroundColor: Colors.error, paddingHorizontal: 7, paddingVertical: 2, borderRadius: Layout.radius.full },
  navBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
