import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Switch, Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  Bell, Shield, Globe, Users, CreditCard,
  Database, LogOut, ChevronLeft, Moon, Smartphone,
} from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface ToggleSetting {
  id: string;
  label: string;
  sublabel?: string;
  value: boolean;
}

export default function OwnerSettings() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    maintenance:       false,
    newRegistrations:  true,
    emailNotifications: true,
    pushNotifications:  true,
    darkMode:          false,
    twoFactor:         true,
    autoBackup:        true,
    devMode:           false,
  });

  const toggle = useCallback((key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/(auth)/login' as never);
          },
        },
      ]
    );
  };

  const sections = [
    {
      title: 'إعدادات النظام',
      icon: <Globe size={16} color={Colors.primary} />,
      items: [
        {
          id: 'maintenance',
          label: 'وضع الصيانة',
          sublabel: 'إيقاف التطبيق مؤقتاً للصيانة',
          type: 'toggle',
        },
        {
          id: 'newRegistrations',
          label: 'السماح بالتسجيلات',
          sublabel: 'تفعيل تسجيل المستخدمين الجدد',
          type: 'toggle',
        },
        {
          id: 'autoBackup',
          label: 'النسخ الاحتياطي التلقائي',
          sublabel: 'نسخ احتياطي يومي لقاعدة البيانات',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'الأمان',
      icon: <Shield size={16} color={Colors.success} />,
      items: [
        {
          id: 'twoFactor',
          label: 'المصادقة الثنائية',
          sublabel: 'حماية إضافية لحساب المالك',
          type: 'toggle',
        },
        {
          id: 'devMode',
          label: 'وضع المطور',
          sublabel: 'تفعيل سجلات التشخيص المفصلة',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'الإشعارات',
      icon: <Bell size={16} color={Colors.warning} />,
      items: [
        {
          id: 'emailNotifications',
          label: 'إشعارات البريد',
          sublabel: 'استقبال تنبيهات عبر البريد الإلكتروني',
          type: 'toggle',
        },
        {
          id: 'pushNotifications',
          label: 'الإشعارات الفورية',
          sublabel: 'تنبيهات النظام الحرجة',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'المظهر',
      icon: <Moon size={16} color='#8b5cf6' />,
      items: [
        {
          id: 'darkMode',
          label: 'الوضع الداكن',
          sublabel: 'تغيير مظهر لوحة التحكم',
          type: 'toggle',
        },
      ],
    },
  ];

  const quickLinks = [
    { label: 'إدارة المستخدمين', icon: <Users size={18} color={Colors.primary} />, route: '/owner/users' },
    { label: 'المدفوعات', icon: <CreditCard size={18} color={Colors.success} />, route: '/owner/payments' },
    { label: 'قاعدة البيانات', icon: <Database size={18} color='#8b5cf6' />, route: '/owner/analytics' },
    { label: 'إعدادات التطبيق', icon: <Smartphone size={18} color={Colors.warning} />, route: '/owner/dashboard' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الإعدادات</Text>
        <Text style={styles.subtitle}>إدارة إعدادات المنصة</Text>
      </View>

      {/* Quick Links */}
      <View style={styles.quickGrid}>
        {quickLinks.map(link => (
          <TouchableOpacity
            key={link.label}
            style={styles.quickCard}
            onPress={() => router.push(link.route as never)}
          >
            <View style={styles.quickIcon}>{link.icon}</View>
            <Text style={styles.quickLabel}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Sections */}
      {sections.map(section => (
        <View key={section.title} style={styles.section}>
          <View style={styles.sectionHeader}>
            {section.icon}
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <View style={styles.sectionCard}>
            {section.items.map((item, idx) => (
              <View key={item.id}>
                {idx > 0 && <View style={styles.divider} />}
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    {item.sublabel && <Text style={styles.settingSubLabel}>{item.sublabel}</Text>}
                  </View>
                  <Switch
                    value={toggles[item.id] ?? false}
                    onValueChange={() => toggle(item.id)}
                    trackColor={{ false: Colors.divider, true: Colors.primary + '80' }}
                    thumbColor={toggles[item.id] ? Colors.primary : Colors.textMuted}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Danger Zone */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <LogOut size={16} color={Colors.error} />
          <Text style={[styles.sectionTitle, { color: Colors.error }]}>تسجيل الخروج</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#fff" />
          <Text style={styles.logoutText}>تسجيل الخروج من لوحة التحكم</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#0f172a', paddingHorizontal: 16,
    paddingTop: 50, paddingBottom: 20,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  subtitle: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10 },
  quickCard: {
    width: (Layout.window.width - 34) / 2,
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg,
    padding: 14, alignItems: 'center', gap: 8, ...Layout.shadow.sm,
  },
  quickIcon: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  quickLabel: { fontSize: Typography.fontSize.xs, color: Colors.textPrimary, fontWeight: Typography.fontWeight.medium, textAlign: 'center' },
  section: { marginHorizontal: 12, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  sectionTitle: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  sectionCard: { backgroundColor: Colors.white, borderRadius: Layout.radius.lg, ...Layout.shadow.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: Typography.fontSize.sm, color: Colors.textPrimary, fontWeight: Typography.fontWeight.medium },
  settingSubLabel: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: 14 },
  logoutBtn: {
    backgroundColor: Colors.error, borderRadius: Layout.radius.lg,
    paddingVertical: 14, paddingHorizontal: 20, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8, ...Layout.shadow.sm,
  },
  logoutText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
});
