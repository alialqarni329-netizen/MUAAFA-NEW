import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Search, UserX, UserCheck } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface AppUser {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  role?: string;
  status?: string;
  created_at: string;
}

export default function OwnerUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filtered, setFiltered] = useState<AppUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const fetchUsers = useCallback(async () => {
    let query = supabase
      .from('users')
      .select('id, full_name, phone, role, status, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter === 'active') query = query.eq('status', 'active');
    else if (filter === 'suspended') query = query.eq('status', 'suspended');

    const { data } = await query;
    setUsers((data ?? []) as AppUser[]);
    setFiltered((data ?? []) as AppUser[]);
    setLoading(false);
    setRefreshing(false);
  }, [filter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.full_name?.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.email?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const suspendUser = async (userId: string, suspend: boolean) => {
    Alert.alert(
      suspend ? 'تعليق الحساب' : 'تفعيل الحساب',
      suspend ? 'هل تريد تعليق هذا الحساب؟' : 'هل تريد تفعيل هذا الحساب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد',
          onPress: async () => {
            await supabase.from('users').update({ status: suspend ? 'suspended' : 'active' }).eq('id', userId);
            fetchUsers();
          },
        },
      ]
    );
  };

  const ROLE_LABELS: Record<string, string> = {
    individual: 'فردي', business_owner: 'مالك منشأة',
    employee: 'موظف', platform_owner: 'مالك المنصة',
  };

  const renderUser = ({ item }: { item: AppUser }) => {
    const isSuspended = item.status === 'suspended';
    return (
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.full_name?.charAt(0) ?? '؟'}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.full_name}</Text>
          <Text style={styles.userPhone}>{item.phone ?? 'بدون رقم'}</Text>
          <View style={styles.badges}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{ROLE_LABELS[item.role ?? ''] ?? item.role}</Text>
            </View>
            {isSuspended && (
              <View style={[styles.roleBadge, { backgroundColor: Colors.error + '15' }]}>
                <Text style={[styles.roleText, { color: Colors.error }]}>موقوف</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.userActions}>
          <Text style={styles.joinDate}>
            {new Date(item.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
          </Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: isSuspended ? Colors.success + '15' : Colors.error + '15' }]}
            onPress={() => suspendUser(item.id, !isSuspended)}
          >
            {isSuspended
              ? <UserCheck size={14} color={Colors.success} />
              : <UserX size={14} color={Colors.error} />}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>إدارة المستخدمين</Text>
        <Text style={styles.count}>{filtered.length} مستخدم</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Search size={16} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث بالاسم أو الجوال..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {([['all', 'الكل'], ['active', 'نشط'], ['suspended', 'موقوف']] as const).map(([key, label]) => (
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
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderUser}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>لا يوجد مستخدمون</Text>
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  count: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    margin: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: Layout.radius.lg, borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  searchInput: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  filterRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 4 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Layout.radius.full, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  filterTabActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  filterText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: Typography.fontWeight.semibold },
  loader: { marginTop: 40 },
  list: { padding: 12, gap: 8 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 12, gap: 10, ...Layout.shadow.sm },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary + '20', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  userInfo: { flex: 1, gap: 3 },
  userName: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  userPhone: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  badges: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  roleBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Layout.radius.full, backgroundColor: Colors.primary + '15' },
  roleText: { fontSize: 10, color: Colors.primary, fontWeight: Typography.fontWeight.medium },
  userActions: { alignItems: 'flex-end', gap: 6 },
  joinDate: { fontSize: 10, color: Colors.textMuted },
  actionBtn: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: Typography.fontSize.md, color: Colors.textMuted },
});
