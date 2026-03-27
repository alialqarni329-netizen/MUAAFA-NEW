import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Mail, ArrowRight } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { forgotPasswordSchema, getFirstError } from '@lib/validation';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    const result = forgotPasswordSchema.safeParse({ email: email.trim() });
    const err = getFirstError(result);
    if (err) { Alert.alert('خطأ في البيانات', err); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    setLoading(false);
    if (error) {
      Alert.alert('خطأ', error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>📧</Text>
          <Text style={styles.successTitle}>تم الإرسال!</Text>
          <Text style={styles.successText}>
            تم إرسال رابط إعادة تعيين كلمة المرور إلى{'\n'}
            <Text style={{ fontWeight: 'bold', color: Colors.primary }}>{email}</Text>
          </Text>
          <TouchableOpacity style={styles.backToLogin} onPress={() => router.replace('/(auth)/login' as never)}>
            <Text style={styles.backToLoginText}>العودة لتسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowRight size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>نسيت كلمة المرور؟</Text>
        <Text style={styles.subtitle}>
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
        </Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <View style={styles.inputRow}>
            <Mail size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
            />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.btnText}>إرسال رابط الاستعادة</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 32, width: 40 },
  content: { gap: 16 },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  inputGroup: { gap: 6 },
  label: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.medium, color: Colors.textSecondary },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  input: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  btn: {
    backgroundColor: Colors.primary, borderRadius: Layout.radius.lg,
    paddingVertical: 15, alignItems: 'center', marginTop: 8, ...Layout.shadow.md,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
  successCard: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 16,
  },
  successIcon: { fontSize: 64 },
  successTitle: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  successText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  backToLogin: {
    backgroundColor: Colors.primary, borderRadius: Layout.radius.lg,
    paddingVertical: 14, paddingHorizontal: 32, marginTop: 8,
  },
  backToLoginText: { color: '#fff', fontWeight: Typography.fontWeight.semibold },
});
