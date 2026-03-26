import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Heart, Shield, Activity } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

const FEATURES = [
  { icon: <Heart size={20} color={Colors.primary} />, label: 'طبيب ذكي مدعوم بالذكاء الاصطناعي' },
  { icon: <Shield size={20} color={Colors.success} />, label: 'إدارة التأمين الصحي بسهولة' },
  { icon: <Activity size={20} color={Colors.warning} />, label: 'تتبع صحتك اليومية' },
];

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Heart size={48} color="#fff" />
        </View>
        <Text style={styles.appName}>مُعافى</Text>
        <Text style={styles.appNameEn}>MUAAFA</Text>
        <Text style={styles.tagline}>منصة الخدمات الصحية المتكاملة</Text>
      </View>

      {/* Features */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>كل ما تحتاجه لصحتك</Text>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIcon}>{f.icon}</View>
            <Text style={styles.featureText}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(auth)/register' as never)}
        >
          <Text style={styles.primaryBtnText}>إنشاء حساب جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/(auth)/login' as never)}
        >
          <Text style={styles.secondaryBtnText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.businessBtn}
          onPress={() => router.push('/business/register' as never)}
        >
          <Text style={styles.businessBtnText}>تسجيل منشأة صحية</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        بالمتابعة، أنت توافق على{' '}
        <Text style={styles.link}>شروط الاستخدام</Text>
        {' '}و{' '}
        <Text style={styles.link}>سياسة الخصوصية</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  hero: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60,
  },
  logoCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, ...Layout.shadow.lg,
  },
  appName: {
    fontSize: 36, fontWeight: Typography.fontWeight.extrabold, color: '#fff',
  },
  appNameEn: {
    fontSize: Typography.fontSize.lg, color: Colors.primary,
    fontWeight: Typography.fontWeight.bold, letterSpacing: 4, marginBottom: 8,
  },
  tagline: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  featuresCard: {
    backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 20,
    borderRadius: Layout.radius.xl, padding: 20, gap: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  featuresTitle: {
    fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold,
    color: '#fff', marginBottom: 4, textAlign: 'center',
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center',
  },
  featureText: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.8)' },
  actions: { padding: 20, gap: 10 },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: Layout.radius.lg,
    paddingVertical: 15, alignItems: 'center', ...Layout.shadow.md,
  },
  primaryBtnText: {
    color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold,
  },
  secondaryBtn: {
    borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Layout.radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.primary, fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold,
  },
  businessBtn: {
    paddingVertical: 10, alignItems: 'center',
  },
  businessBtnText: {
    color: 'rgba(255,255,255,0.5)', fontSize: Typography.fontSize.sm,
    textDecorationLine: 'underline',
  },
  terms: {
    fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.3)',
    textAlign: 'center', paddingBottom: 24, paddingHorizontal: 20,
  },
  link: { color: Colors.primary },
});
