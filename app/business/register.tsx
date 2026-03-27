import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Store, Building2, Truck, Shield } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

type BusinessType = 'clinic' | 'pharmacy' | 'delivery' | 'insurance' | 'hospital' | 'lab';

const BUSINESS_TYPES = [
  { key: 'clinic',    label: 'عيادة',          icon: <Building2 size={22} color={Colors.business} /> },
  { key: 'hospital',  label: 'مستشفى',         icon: <Building2 size={22} color={Colors.error} /> },
  { key: 'pharmacy',  label: 'صيدلية',         icon: <Store size={22} color={Colors.success} /> },
  { key: 'lab',       label: 'مختبر',          icon: <Store size={22} color={Colors.warning} /> },
  { key: 'delivery',  label: 'توصيل',          icon: <Truck size={22} color={Colors.primary} /> },
  { key: 'insurance', label: 'تأمين صحي',      icon: <Shield size={22} color={Colors.info} /> },
] as const;

export default function BusinessRegister() {
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [form, setForm] = useState({
    businessName: '',
    commercialReg: '',
    healthLicense: '',
    phone: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!businessType || !form.businessName || !form.commercialReg) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { error } = await supabase.from('business_registrations').insert({
      owner_id: user.id,
      business_name: form.businessName,
      business_type: businessType,
      commercial_registration: form.commercialReg,
      status: 'pending',
    });

    setLoading(false);
    if (error) {
      Alert.alert('خطأ', error.code === '23505' ? 'رقم السجل التجاري مسجل مسبقاً' : error.message);
    } else {
      router.replace('/business/pending-approval' as never);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>تسجيل منشأة</Text>
        <Text style={styles.subtitle}>سجّل منشأتك الصحية على منصة مُعافى</Text>
      </View>

      {/* Business Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>نوع المنشأة *</Text>
        <View style={styles.typeGrid}>
          {BUSINESS_TYPES.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeCard, businessType === t.key && styles.typeCardActive]}
              onPress={() => setBusinessType(t.key as BusinessType)}
            >
              {t.icon}
              <Text style={[styles.typeLabel, businessType === t.key && styles.typeLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات المنشأة</Text>
        {[
          { key: 'businessName', label: 'اسم المنشأة *', placeholder: 'مثال: عيادة الرحمة' },
          { key: 'commercialReg', label: 'رقم السجل التجاري *', placeholder: '1234567890' },
          { key: 'healthLicense', label: 'رقم الترخيص الصحي', placeholder: 'اختياري' },
          { key: 'phone', label: 'رقم الجوال *', placeholder: '05xxxxxxxx' },
          { key: 'email', label: 'البريد الإلكتروني', placeholder: 'info@example.com' },
          { key: 'address', label: 'العنوان', placeholder: 'الرياض، حي النخيل' },
        ].map(field => (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor={Colors.textMuted}
              value={form[field.key as keyof typeof form]}
              onChangeText={v => setForm(prev => ({ ...prev, [field.key]: v }))}
              textAlign="right"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Text style={styles.submitText}>تقديم طلب التسجيل</Text>}
      </TouchableOpacity>

      <Text style={styles.note}>
        سيتم مراجعة طلبك خلال 1-3 أيام عمل. ستصلك رسالة عند الموافقة.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.business, paddingHorizontal: 16, paddingTop: 60,
    paddingBottom: 24,
  },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: '#fff' },
  subtitle: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { margin: 12 },
  sectionTitle: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textSecondary, marginBottom: 10 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeCard: {
    width: (Layout.window.width - 40) / 3,
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg, padding: 12,
    alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: Colors.border, ...Layout.shadow.sm,
  },
  typeCardActive: { borderColor: Colors.business, backgroundColor: Colors.business + '08' },
  typeLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, textAlign: 'center' },
  typeLabelActive: { color: Colors.business, fontWeight: Typography.fontWeight.semibold },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.white, borderRadius: Layout.radius.md, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: Typography.fontSize.sm, color: Colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: Colors.business, margin: 12, borderRadius: Layout.radius.lg,
    paddingVertical: 14, alignItems: 'center', ...Layout.shadow.md,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
  note: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, textAlign: 'center', margin: 12, marginTop: 0, marginBottom: 32 },
});
