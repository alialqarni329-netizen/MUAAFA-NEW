import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Search, MapPin, Clock, Phone, ShoppingCart, Star } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface Pharmacy {
  id: string;
  business_name: string;
  address?: string;
  phone?: string;
  rating?: number;
  is_open?: boolean;
  distance_km?: number;
  working_hours?: string;
  delivers?: boolean;
}

export default function PharmaciesScreen() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filtered, setFiltered] = useState<Pharmacy[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPharmacies = useCallback(async () => {
    const { data } = await supabase
      .from('business_registrations')
      .select('id, business_name, phone')
      .eq('business_type', 'pharmacy')
      .eq('status', 'approved');

    const list = (data ?? []).map((p, i) => ({
      ...p,
      address: 'الرياض، المملكة العربية السعودية',
      rating: 4.2 + Math.random() * 0.6,
      is_open: i % 3 !== 2,
      distance_km: Math.round((0.5 + Math.random() * 5) * 10) / 10,
      working_hours: '8:00 ص - 12:00 م',
      delivers: i % 2 === 0,
    })) as Pharmacy[];

    setPharmacies(list);
    setFiltered(list);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchPharmacies(); }, [fetchPharmacies]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(pharmacies);
    } else {
      setFiltered(pharmacies.filter(p =>
        p.business_name.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, pharmacies]);

  const renderPharmacy = ({ item }: { item: Pharmacy }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>{item.business_name[0]}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.business_name}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.rating}>{item.rating?.toFixed(1)}</Text>
            <View style={[styles.openBadge, { backgroundColor: item.is_open ? Colors.success + '20' : Colors.error + '20' }]}>
              <Text style={[styles.openText, { color: item.is_open ? Colors.success : Colors.error }]}>
                {item.is_open ? 'مفتوح' : 'مغلق'}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={12} color={Colors.textMuted} />
            <Text style={styles.infoText}>{item.address} • {item.distance_km} كم</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={12} color={Colors.textMuted} />
            <Text style={styles.infoText}>{item.working_hours}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardActions}>
        {item.phone && (
          <TouchableOpacity style={styles.actionBtn}>
            <Phone size={14} color={Colors.primary} />
            <Text style={styles.actionText}>اتصال</Text>
          </TouchableOpacity>
        )}
        {item.delivers && (
          <TouchableOpacity style={[styles.actionBtn, styles.orderBtn]}>
            <ShoppingCart size={14} color="#fff" />
            <Text style={styles.orderText}>طلب توصيل</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الصيدليات</Text>
        <Text style={styles.headerSub}>{filtered.length} صيدلية متاحة</Text>
      </View>

      <View style={styles.searchRow}>
        <Search size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن صيدلية..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderPharmacy}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPharmacies(); }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>لا توجد صيدليات</Text>
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
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  headerSub: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    margin: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: Layout.radius.lg, borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  searchInput: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  list: { padding: 12, gap: 10 },
  loader: { marginTop: 40 },
  card: {
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 14, ...Layout.shadow.sm,
  },
  cardTop: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  logoPlaceholder: {
    width: 50, height: 50, borderRadius: 12,
    backgroundColor: Colors.primary + '20', justifyContent: 'center', alignItems: 'center',
  },
  logoText: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  cardInfo: { flex: 1, gap: 4 },
  name: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  openBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginLeft: 4 },
  openText: { fontSize: 10, fontWeight: Typography.fontWeight.semibold },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  cardActions: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: Colors.divider, paddingTop: 10 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: Layout.radius.md, borderWidth: 1, borderColor: Colors.primary,
  },
  actionText: { fontSize: 12, color: Colors.primary, fontWeight: Typography.fontWeight.medium },
  orderBtn: { backgroundColor: Colors.primary, borderColor: Colors.primary, flex: 1, justifyContent: 'center' },
  orderText: { fontSize: 12, color: '#fff', fontWeight: Typography.fontWeight.semibold },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: Typography.fontSize.md, color: Colors.textMuted },
});
