import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ChevronRight, Bell, Shield, LogOut, Store } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

export default function BusinessSettings() {
  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل تريد تسجيل الخروج من بوابة الأعمال؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: async () => { await supabase.auth.signOut(); router.replace('/(auth)/welcome' as never); } },
    ]);
  };

  const items = [
    { label: 'بيانات المنشأة', icon: <Store size={18} color={Colors.business} />, color: Colors.business },
    { label: 'إعدادات الإشعارات', icon: <Bell size={18} color={Colors.warning} />, color: Colors.warning },
    { label: 'الأمان', icon: <Shield size={18} color={Colors.primary} />, color: Colors.primary },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الإعدادات</Text>
      </View>
      <View style={styles.section}>
        {items.map((item, i) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.icon, { backgroundColor: item.color + '15' }]}>{item.icon}</View>
              <Text style={styles.label}>{item.label}</Text>
              <ChevronRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
            {i < items.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color={Colors.error} />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  section: { margin: 12, backgroundColor: Colors.white, borderRadius: Layout.radius.lg, overflow: 'hidden', ...Layout.shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
  icon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  label: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 12, backgroundColor: Colors.error + '10', borderRadius: Layout.radius.lg, padding: 14, justifyContent: 'center' },
  logoutText: { fontSize: Typography.fontSize.md, color: Colors.error, fontWeight: Typography.fontWeight.semibold },
});
