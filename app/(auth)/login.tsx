import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setLoading(false);
      Alert.alert('خطأ في تسجيل الدخول', 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return;
    }

    // Check user role and redirect accordingly
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    setLoading(false);

    if (adminData?.role === 'owner') {
      router.replace('/owner/dashboard' as never);
    } else if (profile?.role === 'business_owner') {
      router.replace('/business/(tabs)' as never);
    } else {
      router.replace('/(tabs)' as never);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>→</Text>
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <Heart size={28} color={Colors.primary} />
            <Text style={styles.logoText}>مُعافى</Text>
          </View>
          <Text style={styles.title}>تسجيل الدخول</Text>
          <Text style={styles.subtitle}>أهلاً بعودتك! سجّل دخولك للمتابعة</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
                autoCorrect={false}
                textAlign="right"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>كلمة المرور</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                textAlign="right"
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                {showPass
                  ? <EyeOff size={18} color={Colors.textMuted} />
                  : <Eye size={18} color={Colors.textMuted} />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => router.push('/(auth)/forgot-password' as never)}
          >
            <Text style={styles.forgotText}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.loginBtnText}>تسجيل الدخول</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ليس لديك حساب؟ </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/register' as never)}>
            <Text style={styles.footerLink}>إنشاء حساب</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 20 },
  header: { paddingTop: 40, marginBottom: 32 },
  backBtn: { marginBottom: 24 },
  backText: { fontSize: 20, color: Colors.textSecondary },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  logoText: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.primary },
  title: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 6 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.medium, color: Colors.textSecondary },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12,
  },
  input: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  forgotBtn: { alignSelf: 'flex-start' },
  forgotText: { fontSize: Typography.fontSize.sm, color: Colors.primary },
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: Layout.radius.lg,
    paddingVertical: 15, alignItems: 'center', marginTop: 8, ...Layout.shadow.md,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, paddingBottom: 20 },
  footerText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  footerLink: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: Typography.fontWeight.semibold },
});
