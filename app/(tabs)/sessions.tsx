import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Calendar, Clock, Video, MessageCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface Session {
  id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_at: string;
  payment_status: 'pending' | 'paid' | 'failed';
  amount: number;
  notes?: string;
  session_type?: 'video' | 'chat';
  created_at: string;
}

const STATUS_CONFIG = {
  pending:   { label: 'قيد الانتظار', color: Colors.warning,  Icon: AlertCircle },
  confirmed: { label: 'مؤكدة',        color: Colors.primary,  Icon: CheckCircle },
  completed: { label: 'مكتملة',       color: Colors.success,  Icon: CheckCircle },
  cancelled: { label: 'ملغاة',        color: Colors.error,    Icon: XCircle },
} as const;

export default function SessionsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const fetchSessions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from('medical_sessions')
      .select('*')
      .eq('patient_id', user.id)
      .order('scheduled_at', { ascending: false });

    if (filter === 'upcoming') {
      query = query.in('status', ['pending', 'confirmed']).gte('scheduled_at', new Date().toISOString());
    } else if (filter === 'completed') {
      query = query.eq('status', 'completed');
    }

    const { data } = await query;
    if (data) setSessions(data as Session[]);
    setLoading(false);
    setRefreshing(false);
  }, [filter]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const onRefresh = () => { setRefreshing(true); fetchSessions(); };

  const renderSession = ({ item }: { item: Session }) => {
    const cfg = STATUS_CONFIG[item.status];
    const date = new Date(item.scheduled_at);
    const isUpcoming = item.status === 'confirmed' || item.status === 'pending';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: cfg.color + '20' }]}>
            <cfg.Icon size={12} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          <View style={styles.typeTag}>
            {item.session_type === 'video'
              ? <Video size={14} color={Colors.primary} />
              : <MessageCircle size={14} color={Colors.primary} />}
            <Text style={styles.typeText}>{item.session_type === 'video' ? 'فيديو' : 'دردشة'}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Calendar size={14} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {item.notes && (
            <Text style={styles.notes} numberOfLines={2}>{item.notes}</Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.amount}>{item.amount} ريال</Text>
          <View style={[
            styles.payBadge,
            { backgroundColor: item.payment_status === 'paid' ? Colors.success + '20' : Colors.warning + '20' }
          ]}>
            <Text style={[
              styles.payText,
              { color: item.payment_status === 'paid' ? Colors.success : Colors.warning }
            ]}>
              {item.payment_status === 'paid' ? 'مدفوع' : 'في انتظار الدفع'}
            </Text>
          </View>
          {isUpcoming && (
            <TouchableOpacity style={styles.joinBtn}>
              <Text style={styles.joinText}>دخول الجلسة</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>جلساتي الطبية</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {([['all', 'الكل'], ['upcoming', 'القادمة'], ['completed', 'المكتملة']] as const).map(([key, label]) => (
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
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={item => item.id}
          renderItem={renderSession}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
    paddingTop: 50, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  filterRow: {
    flexDirection: 'row', backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingBottom: 12, gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: Layout.radius.full,
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white, fontWeight: Typography.fontWeight.semibold },
  list: { padding: 12, gap: 10 },
  loader: { marginTop: 40 },
  card: {
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 14, ...Layout.shadow.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: Layout.radius.full,
  },
  statusText: { fontSize: 11, fontWeight: Typography.fontWeight.semibold },
  typeTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  typeText: { fontSize: 12, color: Colors.primary },
  cardBody: { gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  notes: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, fontStyle: 'italic', marginTop: 4 },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  amount: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  payBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Layout.radius.full },
  payText: { fontSize: 11, fontWeight: Typography.fontWeight.semibold },
  joinBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: Layout.radius.md,
  },
  joinText: { color: '#fff', fontSize: 12, fontWeight: Typography.fontWeight.semibold },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: Typography.fontSize.md, color: Colors.textMuted },
});
