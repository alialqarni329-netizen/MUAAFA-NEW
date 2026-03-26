import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { DollarSign, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface Transaction {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  reference_type?: string;
  created_at: string;
  user_id?: string;
}

const STATUS_CONFIG = {
  paid:    { label: 'مكتملة', color: Colors.success, Icon: CheckCircle },
  pending: { label: 'معلقة',  color: Colors.warning, Icon: Clock },
  failed:  { label: 'فاشلة',  color: Colors.error,   Icon: XCircle },
} as const;

const REF_LABELS: Record<string, string> = {
  medical_session: 'جلسة طبية',
  pharmacy_order: 'طلب صيدلية',
  subscription: 'اشتراك',
};

export default function OwnerPayments() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ total: 0, paid: 0, pending: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');

  const fetchData = useCallback(async () => {
    let query = supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter !== 'all') query = query.eq('status', filter);

    const [txRes, allRes] = await Promise.all([
      query,
      supabase.from('payment_transactions').select('amount, status'),
    ]);

    setTransactions((txRes.data ?? []) as Transaction[]);
    const all = (allRes.data ?? []) as Transaction[];
    setSummary({
      total: all.reduce((s, t) => s + (t.amount ?? 0), 0),
      paid:    all.filter(t => t.status === 'paid').reduce((s, t) => s + (t.amount ?? 0), 0),
      pending: all.filter(t => t.status === 'pending').reduce((s, t) => s + (t.amount ?? 0), 0),
      failed:  all.filter(t => t.status === 'failed').reduce((s, t) => s + (t.amount ?? 0), 0),
    });
    setLoading(false);
    setRefreshing(false);
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const cfg = STATUS_CONFIG[item.status];
    return (
      <View style={styles.txCard}>
        <View style={[styles.txIcon, { backgroundColor: cfg.color + '15' }]}>
          <cfg.Icon size={18} color={cfg.color} />
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txRef}>{REF_LABELS[item.reference_type ?? ''] ?? 'معاملة'}</Text>
          <Text style={styles.txDate}>
            {new Date(item.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
        <View style={styles.txRight}>
          <Text style={styles.txAmount}>{item.amount.toLocaleString('ar')} ر</Text>
          <View style={[styles.statusBadge, { backgroundColor: cfg.color + '15' }]}>
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={22} color="#fff" />
        <Text style={styles.title}>المدفوعات</Text>
      </View>

      {/* Summary */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryRow}>
        {[
          { label: 'الإجمالي', value: summary.total, color: Colors.primary },
          { label: 'المحصّل', value: summary.paid, color: Colors.success },
          { label: 'المعلق', value: summary.pending, color: Colors.warning },
          { label: 'الفاشل', value: summary.failed, color: Colors.error },
        ].map(s => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value.toLocaleString('ar')}</Text>
            <Text style={styles.summaryLabel}>{s.label} ر</Text>
          </View>
        ))}
      </ScrollView>

      {/* Filters */}
      <View style={styles.filterRow}>
        {([['all', 'الكل'], ['paid', 'مكتملة'], ['pending', 'معلقة'], ['failed', 'فاشلة']] as const).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterTab, filter === key && styles.filterTabActive]}
            onPress={() => setFilter(key)}
          >
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.success} style={styles.loader} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>لا توجد معاملات</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 20,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  summaryRow: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  summaryCard: {
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 14,
    minWidth: 110, alignItems: 'center', ...Layout.shadow.sm,
  },
  summaryValue: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold },
  summaryLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 6, marginBottom: 4 },
  filterTab: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Layout.radius.full, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  filterTabActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  filterText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: Typography.fontWeight.semibold },
  loader: { marginTop: 40 },
  list: { padding: 12, gap: 8 },
  txCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 12, gap: 10, ...Layout.shadow.sm },
  txIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1, gap: 3 },
  txRef: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  txDate: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Layout.radius.full },
  statusText: { fontSize: 10, fontWeight: Typography.fontWeight.semibold },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: Typography.fontSize.md, color: Colors.textMuted },
});
