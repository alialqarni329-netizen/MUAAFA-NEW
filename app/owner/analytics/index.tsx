import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { TrendingUp, Users, DollarSign, Activity, BarChart2 } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface PlatformAnalytics {
  totalUsers: number;
  newUsersThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalSessions: number;
  sessionsThisMonth: number;
  totalBusinesses: number;
  approvedBusinesses: number;
  chatMessages: number;
  avgSessionValue: number;
}

export default function OwnerAnalytics() {
  const [data, setData] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const thisMonth = new Date(); thisMonth.setDate(1);

    const [usersAll, usersMonth, revAll, revMonth, sessAll, sessMonth, bizAll, bizApproved, chats] =
      await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact' }).gte('created_at', thisMonth.toISOString()),
        supabase.from('payment_transactions').select('amount').eq('status', 'paid'),
        supabase.from('payment_transactions').select('amount').eq('status', 'paid').gte('created_at', thisMonth.toISOString()),
        supabase.from('medical_sessions').select('id', { count: 'exact' }),
        supabase.from('medical_sessions').select('id', { count: 'exact' }).gte('created_at', thisMonth.toISOString()),
        supabase.from('business_registrations').select('id', { count: 'exact' }),
        supabase.from('business_registrations').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('chat_messages').select('id', { count: 'exact' }),
      ]);

    const totalRev = (revAll.data ?? []).reduce((s, t) => s + (t.amount ?? 0), 0);
    const monthRev = (revMonth.data ?? []).reduce((s, t) => s + (t.amount ?? 0), 0);

    setData({
      totalUsers: usersAll.count ?? 0,
      newUsersThisMonth: usersMonth.count ?? 0,
      totalRevenue: totalRev,
      revenueThisMonth: monthRev,
      totalSessions: sessAll.count ?? 0,
      sessionsThisMonth: sessMonth.count ?? 0,
      totalBusinesses: bizAll.count ?? 0,
      approvedBusinesses: bizApproved.count ?? 0,
      chatMessages: chats.count ?? 0,
      avgSessionValue: (sessAll.count ?? 0) > 0 ? totalRev / (sessAll.count ?? 1) : 0,
    });
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.success} style={{ flex: 1, marginTop: 100 }} />;
  }

  const sections = [
    {
      title: 'المستخدمون', color: Colors.primary, icon: <Users size={18} color={Colors.primary} />,
      items: [
        { label: 'إجمالي المستخدمين', value: data?.totalUsers.toLocaleString('ar') ?? '0' },
        { label: 'مستخدمون جدد هذا الشهر', value: `+${data?.newUsersThisMonth ?? 0}` },
      ],
    },
    {
      title: 'الإيرادات', color: Colors.success, icon: <DollarSign size={18} color={Colors.success} />,
      items: [
        { label: 'إجمالي الإيرادات', value: `${data?.totalRevenue.toLocaleString('ar') ?? 0} ر` },
        { label: 'إيرادات هذا الشهر', value: `${data?.revenueThisMonth.toLocaleString('ar') ?? 0} ر` },
        { label: 'متوسط قيمة الجلسة', value: `${Math.round(data?.avgSessionValue ?? 0)} ر` },
      ],
    },
    {
      title: 'الجلسات الطبية', color: Colors.business, icon: <Activity size={18} color={Colors.business} />,
      items: [
        { label: 'إجمالي الجلسات', value: data?.totalSessions.toLocaleString('ar') ?? '0' },
        { label: 'جلسات هذا الشهر', value: data?.sessionsThisMonth.toString() ?? '0' },
        { label: 'محادثات الطبيب الذكي', value: data?.chatMessages.toLocaleString('ar') ?? '0' },
      ],
    },
    {
      title: 'المنشآت', color: Colors.warning, icon: <BarChart2 size={18} color={Colors.warning} />,
      items: [
        { label: 'إجمالي المنشآت', value: data?.totalBusinesses.toString() ?? '0' },
        { label: 'المنشآت الموافق عليها', value: data?.approvedBusinesses.toString() ?? '0' },
        {
          label: 'نسبة الموافقة',
          value: data && data.totalBusinesses > 0
            ? `${Math.round((data.approvedBusinesses / data.totalBusinesses) * 100)}%`
            : '0%',
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
    >
      <View style={styles.header}>
        <TrendingUp size={22} color="#fff" />
        <View>
          <Text style={styles.title}>تحليلات المنصة</Text>
          <Text style={styles.subtitle}>إحصائيات شاملة</Text>
        </View>
      </View>

      {sections.map(sec => (
        <View key={sec.title} style={styles.section}>
          <View style={styles.sectionHeader}>
            {sec.icon}
            <Text style={[styles.sectionTitle, { color: sec.color }]}>{sec.title}</Text>
          </View>
          <View style={styles.sectionCard}>
            {sec.items.map((item, i) => (
              <React.Fragment key={item.label}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>{item.label}</Text>
                  <Text style={[styles.statValue, { color: sec.color }]}>{item.value}</Text>
                </View>
                {i < sec.items.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 24,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  subtitle: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  section: { margin: 12, marginBottom: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold },
  sectionCard: { backgroundColor: Colors.white, borderRadius: Layout.radius.lg, overflow: 'hidden', ...Layout.shadow.sm },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  statLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  statValue: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: 16 },
});
