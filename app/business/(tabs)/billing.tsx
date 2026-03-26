import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { CheckCircle, Clock, XCircle, FileText } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface Invoice {
  id: string;
  invoice_number?: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  created_at: string;
  reference_type?: string;
}

const STATUS_CONFIG = {
  paid:    { label: 'مدفوعة', color: Colors.success, Icon: CheckCircle },
  pending: { label: 'معلقة',  color: Colors.warning, Icon: Clock },
  failed:  { label: 'فاشلة',  color: Colors.error,   Icon: XCircle },
} as const;

export default function BusinessBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState({ total: 0, paid: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: biz } = await supabase
      .from('business_registrations')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();
    if (!biz) { setLoading(false); return; }

    const { data } = await supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const list = (data ?? []) as Invoice[];
    setInvoices(list);
    setSummary({
      total: list.reduce((s, i) => s + i.amount, 0),
      paid: list.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
      pending: list.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
    });
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const renderInvoice = ({ item }: { item: Invoice }) => {
    const cfg = STATUS_CONFIG[item.status];
    return (
      <View style={styles.invoiceCard}>
        <View style={styles.invoiceLeft}>
          <View style={[styles.invoiceIcon, { backgroundColor: cfg.color + '15' }]}>
            <cfg.Icon size={18} color={cfg.color} />
          </View>
          <View>
            <Text style={styles.invoiceNum}>{item.invoice_number ?? `INV-${item.id.slice(0, 8).toUpperCase()}`}</Text>
            <Text style={styles.invoiceDate}>
              {new Date(item.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        </View>
        <View style={styles.invoiceRight}>
          <Text style={styles.invoiceAmount}>{item.amount.toLocaleString('ar')} ر</Text>
          <View style={[styles.statusBadge, { backgroundColor: cfg.color + '15' }]}>
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.business} style={{ flex: 1, marginTop: 100 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>المدفوعات والفواتير</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        {[
          { label: 'الإجمالي', value: summary.total, color: Colors.primary },
          { label: 'المحصّل', value: summary.paid, color: Colors.success },
          { label: 'المعلق', value: summary.pending, color: Colors.warning },
        ].map(s => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value.toLocaleString('ar')}</Text>
            <Text style={styles.summaryLabel}>{s.label} ر</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={invoices}
        keyExtractor={item => item.id}
        renderItem={renderInvoice}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FileText size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>لا توجد فواتير</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 50,
    paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  summaryRow: {
    flexDirection: 'row', padding: 12, gap: 8,
  },
  summaryCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 12, alignItems: 'center', ...Layout.shadow.sm,
  },
  summaryValue: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold },
  summaryLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: 12, gap: 8 },
  invoiceCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 14, ...Layout.shadow.sm,
  },
  invoiceLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  invoiceIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  invoiceNum: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  invoiceDate: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2 },
  invoiceRight: { alignItems: 'flex-end', gap: 4 },
  invoiceAmount: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Layout.radius.full },
  statusText: { fontSize: 11, fontWeight: Typography.fontWeight.semibold },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: Typography.fontSize.md, color: Colors.textMuted },
});
