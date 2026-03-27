import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Calendar, CheckCircle, Clock, XCircle, Video, MessageCircle } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { StatusBadge } from '@components/common';
import { useRealtime } from '@hooks/useRealtime';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface BusinessSession {
  id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_at: string;
  payment_status: 'pending' | 'paid' | 'failed';
  amount: number;
  session_type?: 'video' | 'chat';
  patient_id: string;
}

const STATUS_CONFIG = {
  pending:   { label: 'قيد الانتظار', color: Colors.warning,  Icon: Clock },
  confirmed: { label: 'مؤكدة',        color: Colors.primary,  Icon: CheckCircle },
  completed: { label: 'مكتملة',       color: Colors.success,  Icon: CheckCircle },
  cancelled: { label: 'ملغاة',        color: Colors.error,    Icon: XCircle },
} as const;

export default function BusinessSessions() {
  const [sessions, setSessions] = useState<BusinessSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'today' | 'pending'>('all');
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: biz, error: bizErr } = await supabase
        .from('business_registrations')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();
      if (bizErr) throw bizErr;
      if (!biz) { setLoading(false); return; }

      let query = supabase
        .from('medical_sessions')
        .select('*')
        .eq('business_id', biz.id)
        .order('scheduled_at', { ascending: false });

      const today = new Date().toISOString().split('T')[0];
      if (filter === 'today') query = query.gte('scheduled_at', today).lt('scheduled_at', today + 'T23:59:59');
      else if (filter === 'pending') query = query.eq('status', 'pending');

      const { data, error: fetchErr } = await query.limit(50);
      if (fetchErr) throw fetchErr;
      setSessions((data ?? []) as BusinessSession[]);
    } catch {
      setError('تعذر تحميل الجلسات. يرجى المحاولة مجدداً.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // Auto-refresh when any session changes in real-time
  useRealtime({ table: 'medical_sessions', onChange: fetchSessions });

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    await supabase.from('medical_sessions').update({ status }).eq('id', id);
    fetchSessions();
  };

  const renderSession = ({ item }: { item: BusinessSession }) => {
    const cfg = STATUS_CONFIG[item.status];
    const date = new Date(item.scheduled_at);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <StatusBadge
            label={cfg.label}
            color={cfg.color}
            icon={<cfg.Icon size={12} color={cfg.color} />}
          />
          <View style={styles.typeTag}>
            {item.session_type === 'video'
              ? <Video size={13} color={Colors.primary} />
              : <MessageCircle size={13} color={Colors.primary} />}
          </View>
        </View>
        <Text style={styles.dateText}>
          {date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {'  •  '}
          {date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.amount}>{item.amount} ريال</Text>
          {item.status === 'pending' && (
            <View style={styles.actionBtns}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: Colors.success }]}
                onPress={() => updateStatus(item.id, 'confirmed')}
              >
                <Text style={styles.actionText}>قبول</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: Colors.error }]}
                onPress={() => updateStatus(item.id, 'cancelled')}
              >
                <Text style={styles.actionText}>رفض</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>جلسات المرضى</Text>
      </View>
      <View style={styles.filterRow}>
        {([['all', 'الكل'], ['today', 'اليوم'], ['pending', 'بانتظار موافقة']] as const).map(([key, label]) => (
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
        <ActivityIndicator size="large" color={Colors.business} style={styles.loader} />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={item => item.id}
          renderItem={renderSession}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchSessions(); }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Calendar size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>لا توجد جلسات</Text>
            </View>
          }
        />
      )}
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
  filterRow: { flexDirection: 'row', backgroundColor: Colors.white, paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterTab: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Layout.radius.full, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  filterTabActive: { backgroundColor: Colors.business, borderColor: Colors.business },
  filterText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: Typography.fontWeight.semibold },
  loader: { marginTop: 40 },
  list: { padding: 12, gap: 10 },
  card: { backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 14, ...Layout.shadow.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeTag: { padding: 4 },
  dateText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.divider },
  amount: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  actionBtns: { flexDirection: 'row', gap: 6 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Layout.radius.md },
  actionText: { color: '#fff', fontSize: 12, fontWeight: Typography.fontWeight.semibold },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: Typography.fontSize.md, color: Colors.textMuted },
});
