import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Users, DollarSign, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface DashboardStats {
  totalSessions: number;
  confirmedSessions: number;
  totalRevenue: number;
  pendingPayments: number;
  totalEmployees: number;
  todayAppointments: number;
}

interface StatCard {
  label: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

export default function BusinessDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: biz } = await supabase
      .from('business_registrations')
      .select('id, business_name')
      .eq('owner_id', user.id)
      .eq('status', 'approved')
      .maybeSingle();

    if (!biz) { setLoading(false); return; }
    setBusinessId(biz.id);
    setBusinessName(biz.business_name);

    const today = new Date().toISOString().split('T')[0];

    const [sessRes, revRes, empRes, todayRes] = await Promise.all([
      supabase.from('medical_sessions').select('id, status', { count: 'exact' }).eq('business_id', biz.id),
      supabase.from('payment_transactions').select('amount').eq('reference_type', 'medical_session').eq('status', 'paid'),
      supabase.from('business_employees').select('id', { count: 'exact' }).eq('business_id', biz.id),
      supabase.from('medical_sessions').select('id', { count: 'exact' }).eq('business_id', biz.id).gte('scheduled_at', today),
    ]);

    const confirmed = (sessRes.data ?? []).filter(s => s.status === 'confirmed').length;
    const revenue = (revRes.data ?? []).reduce((sum, t) => sum + (t.amount ?? 0), 0);

    setStats({
      totalSessions: sessRes.count ?? 0,
      confirmedSessions: confirmed,
      totalRevenue: revenue,
      pendingPayments: (sessRes.data ?? []).filter(s => s.status === 'pending').length,
      totalEmployees: empRes.count ?? 0,
      todayAppointments: todayRes.count ?? 0,
    });
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.business} style={{ flex: 1, marginTop: 100 }} />;
  }

  const statCards: StatCard[] = stats
    ? [
        {
          label: 'إجمالي الجلسات',
          value: stats.totalSessions.toString(),
          trend: 12,
          icon: <Calendar size={20} color="#fff" />,
          color: Colors.business,
        },
        {
          label: 'الإيرادات',
          value: `${stats.totalRevenue.toLocaleString('ar')} ر`,
          trend: 8,
          icon: <DollarSign size={20} color="#fff" />,
          color: Colors.success,
        },
        {
          label: 'الموظفين',
          value: stats.totalEmployees.toString(),
          icon: <Users size={20} color="#fff" />,
          color: Colors.primary,
        },
        {
          label: 'مواعيد اليوم',
          value: stats.todayAppointments.toString(),
          trend: -3,
          icon: <TrendingUp size={20} color="#fff" />,
          color: Colors.warning,
        },
      ]
    : [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>مرحباً بك في</Text>
          <Text style={styles.businessName}>{businessName}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
          </Text>
        </View>
      </View>

      {!stats ? (
        <View style={styles.noApproval}>
          <Text style={styles.noApprovalText}>منشأتك قيد المراجعة أو لم تُوافَق عليها بعد</Text>
        </View>
      ) : (
        <>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {statCards.map((card, i) => (
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: card.color }]}>{card.icon}</View>
                <Text style={styles.statValue}>{card.value}</Text>
                <Text style={styles.statLabel}>{card.label}</Text>
                {card.trend !== undefined && (
                  <View style={styles.trendRow}>
                    {card.trend >= 0
                      ? <ArrowUpRight size={12} color={Colors.success} />
                      : <ArrowDownRight size={12} color={Colors.error} />}
                    <Text style={[styles.trendText, { color: card.trend >= 0 ? Colors.success : Colors.error }]}>
                      {Math.abs(card.trend)}%
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
            <View style={styles.actionsRow}>
              {[
                { label: 'جلسة جديدة', color: Colors.business },
                { label: 'إضافة موظف', color: Colors.primary },
                { label: 'تقرير مالي', color: Colors.success },
              ].map(a => (
                <TouchableOpacity key={a.label} style={[styles.quickBtn, { borderColor: a.color }]}>
                  <Text style={[styles.quickBtnText, { color: a.color }]}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pending Payments Alert */}
          {stats.pendingPayments > 0 && (
            <View style={styles.alertCard}>
              <Text style={styles.alertText}>
                {stats.pendingPayments} جلسة بانتظار الدفع
              </Text>
              <TouchableOpacity style={styles.alertBtn}>
                <Text style={styles.alertBtnText}>عرض</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    backgroundColor: Colors.business, paddingHorizontal: 16, paddingTop: 50, paddingBottom: 24,
  },
  greeting: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.8)' },
  businessName: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff', marginTop: 2 },
  dateBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: Layout.radius.full,
  },
  dateText: { color: '#fff', fontSize: Typography.fontSize.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10 },
  statCard: {
    width: (Layout.window.width - 34) / 2,
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 14, ...Layout.shadow.sm, alignItems: 'flex-start',
  },
  statIcon: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  statValue: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  statLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 2 },
  trendText: { fontSize: 11, fontWeight: Typography.fontWeight.semibold },
  section: { margin: 12 },
  sectionTitle: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary, marginBottom: 10 },
  actionsRow: { flexDirection: 'row', gap: 8 },
  quickBtn: {
    flex: 1, paddingVertical: 10, borderRadius: Layout.radius.md,
    borderWidth: 1.5, alignItems: 'center',
  },
  quickBtnText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold },
  alertCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    margin: 12, backgroundColor: Colors.warning + '15', borderRadius: Layout.radius.lg,
    padding: 14, borderWidth: 1, borderColor: Colors.warning + '30',
  },
  alertText: { fontSize: Typography.fontSize.sm, color: Colors.textPrimary, flex: 1 },
  alertBtn: {
    backgroundColor: Colors.warning, paddingHorizontal: 12, paddingVertical: 5, borderRadius: Layout.radius.md,
  },
  alertBtnText: { color: '#fff', fontSize: 12, fontWeight: Typography.fontWeight.semibold },
  noApproval: { margin: 20, padding: 20, backgroundColor: Colors.white, borderRadius: Layout.radius.lg, alignItems: 'center' },
  noApprovalText: { color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
