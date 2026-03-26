import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Building2, CheckCircle, XCircle, Clock, Store, Truck, Shield } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface Business {
  id: string;
  business_name: string;
  business_type: string;
  commercial_registration: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  created_at: string;
  owner_id: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  pharmacy:  <Store size={16} color={Colors.success} />,
  clinic:    <Building2 size={16} color={Colors.primary} />,
  hospital:  <Building2 size={16} color={Colors.error} />,
  delivery:  <Truck size={16} color={Colors.warning} />,
  insurance: <Shield size={16} color={Colors.info} />,
  lab:       <Store size={16} color={Colors.business} />,
};
const TYPE_LABELS: Record<string, string> = {
  pharmacy: 'صيدلية', clinic: 'عيادة', hospital: 'مستشفى',
  delivery: 'توصيل', insurance: 'تأمين', lab: 'مختبر',
};

export default function OwnerBusinessMgmt() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const fetchData = useCallback(async () => {
    let query = supabase
      .from('business_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setBusinesses((data ?? []) as Business[]);
    setLoading(false);
    setRefreshing(false);
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    Alert.alert(
      status === 'approved' ? 'موافقة' : 'رفض',
      `هل تريد ${status === 'approved' ? 'الموافقة على' : 'رفض'} هذه المنشأة؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد',
          onPress: async () => {
            await supabase.from('business_registrations').update({ status }).eq('id', id);
            fetchData();
          },
        },
      ]
    );
  };

  const renderBusiness = ({ item }: { item: Business }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typeRow}>
          {TYPE_ICONS[item.business_type] ?? <Building2 size={16} color={Colors.textMuted} />}
          <Text style={styles.typeLabel}>{TYPE_LABELS[item.business_type] ?? item.business_type}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </View>
      <Text style={styles.bizName}>{item.business_name}</Text>
      <Text style={styles.regNum}>السجل التجاري: {item.commercial_registration}</Text>

      {item.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.success }]}
            onPress={() => updateStatus(item.id, 'approved')}
          >
            <CheckCircle size={14} color="#fff" />
            <Text style={styles.actionText}>موافقة</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.error }]}
            onPress={() => updateStatus(item.id, 'rejected')}
          >
            <XCircle size={14} color="#fff" />
            <Text style={styles.actionText}>رفض</Text>
          </TouchableOpacity>
        </View>
      )}
      {item.status !== 'pending' && (
        <View style={[styles.statusBadge, {
          backgroundColor: item.status === 'approved' ? Colors.success + '15' : Colors.error + '15',
        }]}>
          {item.status === 'approved'
            ? <CheckCircle size={13} color={Colors.success} />
            : <XCircle size={13} color={Colors.error} />}
          <Text style={[styles.statusText, { color: item.status === 'approved' ? Colors.success : Colors.error }]}>
            {item.status === 'approved' ? 'موافق عليها' : 'مرفوضة'}
          </Text>
        </View>
      )}
    </View>
  );

  const pendingCount = businesses.filter(b => b.status === 'pending').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>إدارة المنشآت</Text>
        {pendingCount > 0 && filter === 'pending' && (
          <View style={styles.pendingBadge}>
            <Clock size={12} color="#fff" />
            <Text style={styles.pendingCount}>{pendingCount} بانتظار</Text>
          </View>
        )}
      </View>
      <View style={styles.filterRow}>
        {([['pending', 'بانتظار الموافقة'], ['approved', 'موافق عليها'], ['rejected', 'مرفوضة'], ['all', 'الكل']] as const).map(([key, label]) => (
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
          data={businesses}
          keyExtractor={item => item.id}
          renderItem={renderBusiness}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>لا توجد منشآت</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  pendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.warning, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Layout.radius.full },
  pendingCount: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  filterTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Layout.radius.full, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  filterTabActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  filterText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: Typography.fontWeight.semibold },
  loader: { marginTop: 40 },
  list: { padding: 12, gap: 10 },
  card: { backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 14, ...Layout.shadow.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  typeLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  date: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  bizName: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary, marginBottom: 4 },
  regNum: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginBottom: 10 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: Layout.radius.md },
  actionText: { color: '#fff', fontSize: 13, fontWeight: Typography.fontWeight.semibold },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Layout.radius.full },
  statusText: { fontSize: 12, fontWeight: Typography.fontWeight.semibold },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: Typography.fontSize.md, color: Colors.textMuted },
});
