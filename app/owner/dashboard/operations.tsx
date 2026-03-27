import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { UserPlus, CreditCard, Building2, MessageSquare, Calendar } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface Operation {
  id: string;
  type: 'user_signup' | 'payment' | 'business_reg' | 'session' | 'chat';
  description: string;
  time: string;
  status: 'success' | 'pending' | 'failed';
}

const TYPE_CONFIG = {
  user_signup:   { label: 'تسجيل مستخدم', icon: <UserPlus size={16} color="#fff" />, color: Colors.primary },
  payment:       { label: 'دفعة مالية',   icon: <CreditCard size={16} color="#fff" />, color: Colors.success },
  business_reg:  { label: 'تسجيل منشأة', icon: <Building2 size={16} color="#fff" />, color: Colors.business },
  session:       { label: 'جلسة طبية',   icon: <Calendar size={16} color="#fff" />, color: Colors.warning },
  chat:          { label: 'محادثة ذكاء', icon: <MessageSquare size={16} color="#fff" />, color: '#8b5cf6' },
} as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  return `منذ ${Math.floor(hrs / 24)} يوم`;
}

export default function OwnerOperations() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({ total: 0, success: 0, rate: 0 });

  const fetchOps = useCallback(async () => {
    const [users, payments, businesses, sessions, chats] = await Promise.all([
      supabase.from('users').select('id, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('payment_transactions').select('id, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('business_registrations').select('id, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('medical_sessions').select('id, created_at').order('created_at', { ascending: false }).limit(4),
      supabase.from('chat_conversations').select('id, created_at').order('created_at', { ascending: false }).limit(3),
    ]);

    const ops: Operation[] = [
      ...(users.data ?? []).map(u => ({ id: u.id, type: 'user_signup' as const, description: 'انضم مستخدم جديد للمنصة', time: u.created_at, status: 'success' as const })),
      ...(payments.data ?? []).map(p => ({ id: p.id, type: 'payment' as const, description: 'تمت معالجة دفعة مالية', time: p.created_at, status: p.status === 'paid' ? 'success' as const : 'pending' as const })),
      ...(businesses.data ?? []).map(b => ({ id: b.id, type: 'business_reg' as const, description: 'طلب تسجيل منشأة جديدة', time: b.created_at, status: 'pending' as const })),
      ...(sessions.data ?? []).map(s => ({ id: s.id, type: 'session' as const, description: 'جلسة طبية جديدة', time: s.created_at, status: 'success' as const })),
      ...(chats.data ?? []).map(c => ({ id: c.id, type: 'chat' as const, description: 'محادثة جديدة مع الطبيب الذكي', time: c.created_at, status: 'success' as const })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 15);

    const successCount = ops.filter(o => o.status === 'success').length;
    setSummary({ total: ops.length, success: successCount, rate: ops.length > 0 ? Math.round((successCount / ops.length) * 100) : 0 });
    setOperations(ops);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchOps(); }, [fetchOps]);

  const renderOp = ({ item }: { item: Operation }) => {
    const cfg = TYPE_CONFIG[item.type];
    return (
      <View style={styles.opRow}>
        <View style={[styles.opIcon, { backgroundColor: cfg.color }]}>{cfg.icon}</View>
        <View style={styles.opInfo}>
          <Text style={styles.opType}>{cfg.label}</Text>
          <Text style={styles.opDesc} numberOfLines={1}>{item.description}</Text>
        </View>
        <View style={styles.opRight}>
          <Text style={styles.opTime}>{timeAgo(item.time)}</Text>
          <View style={[styles.opStatus, {
            backgroundColor: item.status === 'success' ? Colors.success + '15' : Colors.warning + '15'
          }]}>
            <Text style={[styles.opStatusText, {
              color: item.status === 'success' ? Colors.success : Colors.warning
            }]}>
              {item.status === 'success' ? 'ناجح' : 'معلق'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>آخر العمليات</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        {[
          { label: 'إجمالي العمليات', value: summary.total, color: Colors.primary },
          { label: 'الناجحة', value: summary.success, color: Colors.success },
          { label: 'معدل النجاح', value: `${summary.rate}%`, color: Colors.warning },
        ].map(s => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={[styles.summaryVal, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={operations}
          keyExtractor={item => item.id}
          renderItem={renderOp}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOps(); }} />}
          ListEmptyComponent={<Text style={styles.empty}>لا توجد عمليات</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 18 },
  title: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  summaryRow: { flexDirection: 'row', padding: 12, gap: 8 },
  summaryCard: { flex: 1, backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 12, alignItems: 'center', ...Layout.shadow.sm },
  summaryVal: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold },
  summaryLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },
  list: { padding: 12, gap: 8 },
  opRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg, padding: 12, gap: 10, ...Layout.shadow.sm,
  },
  opIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  opInfo: { flex: 1, gap: 2 },
  opType: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  opDesc: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  opRight: { alignItems: 'flex-end', gap: 4 },
  opTime: { fontSize: 10, color: Colors.textMuted },
  opStatus: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  opStatusText: { fontSize: 10, fontWeight: Typography.fontWeight.semibold },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 40 },
});
