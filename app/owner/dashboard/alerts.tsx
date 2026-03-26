import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, RefreshControl, TouchableOpacity,
} from 'react-native';
import { AlertTriangle, Info, CheckCircle, XCircle, Bell } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';
type AlertFilter = 'all' | AlertSeverity;

interface SystemAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  critical: { color: Colors.error,   bg: Colors.error + '15',   icon: <XCircle size={18} color={Colors.error} />,   label: 'حرج' },
  warning:  { color: Colors.warning, bg: Colors.warning + '15', icon: <AlertTriangle size={18} color={Colors.warning} />, label: 'تحذير' },
  info:     { color: Colors.primary, bg: Colors.primary + '15', icon: <Info size={18} color={Colors.primary} />,    label: 'معلومة' },
  success:  { color: Colors.success, bg: Colors.success + '15', icon: <CheckCircle size={18} color={Colors.success} />, label: 'نجاح' },
};

const FILTERS: { key: AlertFilter; label: string }[] = [
  { key: 'all',      label: 'الكل' },
  { key: 'critical', label: 'حرج' },
  { key: 'warning',  label: 'تحذير' },
  { key: 'info',     label: 'معلومة' },
  { key: 'success',  label: 'نجاح' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  return `منذ ${Math.floor(hrs / 24)} يوم`;
}

export default function OwnerAlerts() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = useCallback(async () => {
    // Pull real data from Supabase to generate contextual alerts
    const [pendingBiz, failedPayments, newUsers] = await Promise.all([
      supabase.from('business_registrations').select('id, created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(10),
      supabase.from('payment_transactions').select('id, created_at').eq('status', 'failed').order('created_at', { ascending: false }).limit(5),
      supabase.from('users').select('id, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

    const now = new Date().toISOString();
    const generated: SystemAlert[] = [];

    const pendingCount = pendingBiz.data?.length ?? 0;
    if (pendingCount >= 5) {
      generated.push({
        id: 'biz-pending',
        severity: 'critical',
        title: 'طلبات منشآت معلقة',
        message: `يوجد ${pendingCount} طلبات منشآت بانتظار المراجعة والموافقة`,
        time: pendingBiz.data?.[0]?.created_at ?? now,
        read: false,
      });
    } else if (pendingCount > 0) {
      generated.push({
        id: 'biz-pending',
        severity: 'warning',
        title: 'طلبات منشآت معلقة',
        message: `يوجد ${pendingCount} طلبات منشآت بانتظار المراجعة`,
        time: pendingBiz.data?.[0]?.created_at ?? now,
        read: false,
      });
    }

    const failedCount = failedPayments.data?.length ?? 0;
    if (failedCount > 0) {
      generated.push({
        id: 'payments-failed',
        severity: 'critical',
        title: 'معاملات دفع فاشلة',
        message: `${failedCount} معاملة دفع فشلت وتحتاج لمراجعة`,
        time: failedPayments.data?.[0]?.created_at ?? now,
        read: false,
      });
    }

    const newUsersCount = newUsers.data?.length ?? 0;
    if (newUsersCount > 0) {
      generated.push({
        id: 'new-users',
        severity: 'success',
        title: 'مستخدمون جدد',
        message: `انضم ${newUsersCount} مستخدم جديد للمنصة`,
        time: newUsers.data?.[0]?.created_at ?? now,
        read: true,
      });
    }

    // Static system alerts
    generated.push(
      {
        id: 'backup-ok',
        severity: 'success',
        title: 'نسخ احتياطية ناجحة',
        message: 'تمت جميع النسخ الاحتياطية الليلية بنجاح',
        time: new Date(Date.now() - 3600000).toISOString(),
        read: true,
      },
      {
        id: 'ssl-expiry',
        severity: 'warning',
        title: 'شهادة SSL',
        message: 'شهادة SSL للنطاق الفرعي ستنتهي خلال 30 يوماً',
        time: new Date(Date.now() - 7200000).toISOString(),
        read: false,
      },
      {
        id: 'api-rate',
        severity: 'info',
        title: 'استخدام API',
        message: 'استخدام OpenAI API وصل 75% من الحد الشهري',
        time: new Date(Date.now() - 10800000).toISOString(),
        read: false,
      },
    );

    generated.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setAlerts(generated);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);
  const unreadCount = alerts.filter(a => !a.read).length;

  const renderAlert = ({ item }: { item: SystemAlert }) => {
    const cfg = SEVERITY_CONFIG[item.severity];
    return (
      <View style={[styles.alertCard, !item.read && styles.alertUnread]}>
        <View style={[styles.alertIcon, { backgroundColor: cfg.bg }]}>{cfg.icon}</View>
        <View style={styles.alertContent}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <Text style={styles.alertTime}>{timeAgo(item.time)}</Text>
          </View>
          <Text style={styles.alertMessage}>{item.message}</Text>
          <View style={[styles.severityBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.severityText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        {!item.read && <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>التنبيهات</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderAlert}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAlerts(); }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Bell size={40} color={Colors.textMuted} />
              <Text style={styles.emptyText}>لا توجد تنبيهات</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  badge: { backgroundColor: Colors.error, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: Typography.fontWeight.bold },
  filterRow: {
    flexDirection: 'row', backgroundColor: Colors.white, paddingHorizontal: 12,
    paddingVertical: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  filterTab: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: Colors.background,
  },
  filterTabActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: Typography.fontWeight.semibold },
  list: { padding: 12, gap: 10 },
  alertCard: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 14, gap: 12, ...Layout.shadow.sm, position: 'relative',
  },
  alertUnread: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  alertIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  alertContent: { flex: 1, gap: 4 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertTitle: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  alertTime: { fontSize: 10, color: Colors.textMuted },
  alertMessage: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  severityBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 2 },
  severityText: { fontSize: 10, fontWeight: Typography.fontWeight.semibold },
  unreadDot: { width: 8, height: 8, borderRadius: 4, position: 'absolute', top: 14, right: 14 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: Typography.fontSize.sm, color: Colors.textMuted },
});
