import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, RefreshControl,
  Alert, TextInput, Modal,
} from 'react-native';
import { UserPlus, Search, Phone, Mail, Shield, User, X } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

type EmployeeRole = 'doctor' | 'nurse' | 'admin' | 'pharmacist' | 'receptionist';
type EmployeeStatus = 'active' | 'inactive';
type FilterType = 'all' | EmployeeRole;

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  created_at: string;
}

const ROLE_CONFIG: Record<EmployeeRole, { label: string; color: string }> = {
  doctor:       { label: 'طبيب',    color: Colors.primary },
  nurse:        { label: 'ممرض/ة', color: Colors.success },
  admin:        { label: 'إداري',   color: '#8b5cf6' },
  pharmacist:   { label: 'صيدلاني', color: Colors.warning },
  receptionist: { label: 'استقبال', color: Colors.business },
};

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all',          label: 'الكل' },
  { key: 'doctor',       label: 'أطباء' },
  { key: 'nurse',        label: 'تمريض' },
  { key: 'admin',        label: 'إداريون' },
  { key: 'pharmacist',   label: 'صيادلة' },
  { key: 'receptionist', label: 'استقبال' },
];

export default function BusinessEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ full_name: '', email: '', phone: '', role: 'doctor' as EmployeeRole });
  const [adding, setAdding] = useState(false);

  const fetchEmployees = useCallback(async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) { setLoading(false); return; }

    const { data: biz } = await supabase
      .from('business_registrations')
      .select('id')
      .eq('owner_id', session.session.user.id)
      .maybeSingle();

    if (!biz) { setLoading(false); setRefreshing(false); return; }

    const { data } = await supabase
      .from('business_employees')
      .select('*')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: false });

    setEmployees((data as Employee[]) ?? []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleAddEmployee = async () => {
    if (!addForm.full_name.trim() || !addForm.email.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم والبريد الإلكتروني');
      return;
    }

    setAdding(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) { setAdding(false); return; }

    const { data: biz } = await supabase
      .from('business_registrations')
      .select('id')
      .eq('owner_id', session.session.user.id)
      .maybeSingle();

    if (!biz) { setAdding(false); return; }

    const { error } = await supabase.from('business_employees').insert({
      business_id: biz.id,
      full_name: addForm.full_name.trim(),
      email: addForm.email.trim().toLowerCase(),
      phone: addForm.phone.trim(),
      role: addForm.role,
      status: 'active',
    });

    setAdding(false);
    if (error) {
      Alert.alert('خطأ', 'تعذر إضافة الموظف');
    } else {
      setShowAddModal(false);
      setAddForm({ full_name: '', email: '', phone: '', role: 'doctor' });
      fetchEmployees();
    }
  };

  const handleToggleStatus = async (emp: Employee) => {
    const newStatus: EmployeeStatus = emp.status === 'active' ? 'inactive' : 'active';
    await supabase.from('business_employees').update({ status: newStatus }).eq('id', emp.id);
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: newStatus } : e));
  };

  const filtered = employees.filter(e => {
    const matchRole = filter === 'all' || e.role === filter;
    const matchSearch = !search || e.full_name.toLowerCase().includes(search.toLowerCase()) || e.email.includes(search);
    return matchRole && matchSearch;
  });

  const renderEmployee = ({ item }: { item: Employee }) => {
    const roleCfg = ROLE_CONFIG[item.role];
    return (
      <View style={styles.empCard}>
        <View style={[styles.avatar, { backgroundColor: roleCfg.color + '20' }]}>
          <User size={20} color={roleCfg.color} />
        </View>
        <View style={styles.empInfo}>
          <Text style={styles.empName}>{item.full_name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: roleCfg.color + '15' }]}>
            <Text style={[styles.roleText, { color: roleCfg.color }]}>{roleCfg.label}</Text>
          </View>
          <View style={styles.empContact}>
            {item.email ? (
              <View style={styles.contactRow}>
                <Mail size={11} color={Colors.textMuted} />
                <Text style={styles.contactText}>{item.email}</Text>
              </View>
            ) : null}
            {item.phone ? (
              <View style={styles.contactRow}>
                <Phone size={11} color={Colors.textMuted} />
                <Text style={styles.contactText}>{item.phone}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.statusBtn, { backgroundColor: item.status === 'active' ? Colors.success + '15' : Colors.error + '15' }]}
          onPress={() => handleToggleStatus(item)}
        >
          <Text style={[styles.statusText, { color: item.status === 'active' ? Colors.success : Colors.error }]}>
            {item.status === 'active' ? 'نشط' : 'معطل'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>الموظفون</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <UserPlus size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Search size={16} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="بحث عن موظف..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </View>

      {/* Filter Tabs */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={f => f.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        renderItem={({ item: f }) => (
          <TouchableOpacity
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Count */}
      <Text style={styles.countText}>{filtered.length} موظف</Text>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.business} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderEmployee}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchEmployees(); }} />}
          ListEmptyComponent={<Text style={styles.empty}>لا يوجد موظفون</Text>}
        />
      )}

      {/* Add Employee Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة موظف</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {[
              { key: 'full_name', label: 'الاسم الكامل', placeholder: 'اسم الموظف' },
              { key: 'email',     label: 'البريد الإلكتروني', placeholder: 'example@email.com' },
              { key: 'phone',     label: 'رقم الجوال', placeholder: '05xxxxxxxx' },
            ].map(field => (
              <View key={field.key} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  value={addForm[field.key as keyof typeof addForm]}
                  onChangeText={v => setAddForm(prev => ({ ...prev, [field.key]: v }))}
                  textAlign="right"
                />
              </View>
            ))}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>الدور الوظيفي</Text>
              <View style={styles.roleOptions}>
                {(Object.keys(ROLE_CONFIG) as EmployeeRole[]).map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleOption, addForm.role === role && { backgroundColor: ROLE_CONFIG[role].color + '20', borderColor: ROLE_CONFIG[role].color }]}
                    onPress={() => setAddForm(prev => ({ ...prev, role }))}
                  >
                    <Text style={[styles.roleOptionText, addForm.role === role && { color: ROLE_CONFIG[role].color }]}>
                      {ROLE_CONFIG[role].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={[styles.saveBtn, adding && { opacity: 0.6 }]} onPress={handleAddEmployee} disabled={adding}>
              <Text style={styles.saveBtnText}>{adding ? 'جاري الإضافة...' : 'إضافة الموظف'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.business, paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  addBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white,
    marginHorizontal: 12, marginTop: 12, borderRadius: Layout.radius.lg,
    paddingHorizontal: 12, paddingVertical: 10, ...Layout.shadow.sm,
  },
  searchInput: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  filterContainer: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border,
  },
  filterTabActive: { backgroundColor: Colors.business, borderColor: Colors.business },
  filterText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: Typography.fontWeight.semibold },
  countText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, paddingHorizontal: 16, marginBottom: 6 },
  list: { padding: 12, gap: 10 },
  empCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg, padding: 12, gap: 12, ...Layout.shadow.sm,
  },
  avatar: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  empInfo: { flex: 1, gap: 4 },
  empName: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  roleText: { fontSize: 10, fontWeight: Typography.fontWeight.semibold },
  empContact: { gap: 2, marginTop: 2 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  contactText: { fontSize: 10, color: Colors.textMuted },
  statusBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 40, fontSize: Typography.fontSize.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, gap: 14,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.medium, color: Colors.textSecondary },
  fieldInput: {
    backgroundColor: Colors.background, borderRadius: Layout.radius.md,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: Typography.fontSize.sm, color: Colors.textPrimary,
  },
  roleOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleOption: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background,
  },
  roleOptionText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  saveBtn: {
    backgroundColor: Colors.business, borderRadius: Layout.radius.lg,
    paddingVertical: 14, alignItems: 'center', marginTop: 4,
  },
  saveBtnText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
});
