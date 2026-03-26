import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!form.fullName.trim()) return 'يرجى إدخال الاسم الكامل';
    if (!form.email.trim() || !form.email.includes('@')) return 'يرجى إدخال بريد إلكتروني صحيح';
    if (!form.phone.trim() || form.phone.length < 10) return 'يرجى إدخال رقم جوال صحيح';
    if (form.password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (form.password !== form.confirmPassword) return 'كلمتا المرور غير متطابقتين';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { Alert.alert('خطأ', err); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: { full_name: form.fullName.trim(), phone: form.phone.trim() },
      },
    });

    if (error) {
      setLoading(false);
      if (error.message.includes('already registered')) {
        Alert.alert('خطأ', 'هذا البريد الإلكتروني مسجّل مسبقاً');
      } else {
        Alert.alert('خطأ في التسجيل', error.message);
      }
      return;
    }

    if (data.user) {
      await supabase.from('users').upsert({
        id: data.user.id,
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        role: 'individual',
        status: 'active',
      });
    }

    setLoading(false);
    Alert.alert(
      'تم التسجيل بنجاح!',
      'مرحباً بك في مُعافى. يمكنك الآن تسجيل الدخول.',
      [{ text: 'تسجيل الدخول', onPress: () => router.replace('/(tabs)' as never) }]
    );
  };

  const fields = [
    { key: 'fullName', label: 'الاسم الكامل *', placeholder: 'محمد أحمد', icon: <User size={18} color={Colors.textMuted} />, type: 'default' },
    { key: 'email', label: 'البريد الإلكتروني *', placeholder: 'example@email.com', icon: <Mail size={18} color={Colors.textMuted} />, type: 'email-address' },
    { key: 'phone', label: 'رقم الجوال *', placeholder: '05xxxxxxxx', icon: <Phone size={18} color={Colors.textMuted} />, type: 'phone-pad' },
  ] as const;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>→</Text>
          </TouchableOpacity>
          <Text style={styles.title}>إنشاء حساب</Text>
          <Text style={styles.subtitle}>سجّل بياناتك للبدء في استخدام مُعافى</Text>
        </View>

        <View style={styles.form}>
          {fields.map(f => (
            <View key={f.key} style={styles.inputGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={styles.inputRow}>
                {f.icon}
                <TextInput
                  style={styles.input}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  value={form[f.key]}
                  onChangeText={v => update(f.key, v)}
                  keyboardType={f.type as never}
                  autoCapitalize="none"
                  textAlign="right"
                />
              </View>
            </View>
          ))}

          {/* Password */}
          {(['password', 'confirmPassword'] as const).map((key, i) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{i === 0 ? 'كلمة المرور *' : 'تأكيد كلمة المرور *'}</Text>
              <View style={styles.inputRow}>
                <Lock size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  value={form[key]}
                  onChangeText={v => update(key, v)}
                  secureTextEntry={!showPass}
                  textAlign="right"
                />
                {i === 0 && (
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} color={Colors.textMuted} /> : <Eye size={18} color={Colors.textMuted} />}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.registerBtnText}>إنشاء الحساب</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>لديك حساب بالفعل؟ </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login' as never)}>
            <Text style={styles.footerLink}>تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 20 },
  header: { paddingTop: 40, marginBottom: 28 },
  backBtn: { marginBottom: 20 },
  backText: { fontSize: 20, color: Colors.textSecondary },
  title: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 6 },
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  label: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.medium, color: Colors.textSecondary },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 11,
  },
  input: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  registerBtn: {
    backgroundColor: Colors.primary, borderRadius: Layout.radius.lg,
    paddingVertical: 15, alignItems: 'center', marginTop: 8, ...Layout.shadow.md,
  },
  registerBtnDisabled: { opacity: 0.6 },
  registerBtnText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, paddingBottom: 20 },
  footerText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  footerLink: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: Typography.fontWeight.semibold },
});
