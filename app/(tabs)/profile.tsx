import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import {
  User, Shield, Bell, LogOut, ChevronRight,
  Heart, FileText, Wallet, Settings,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error: fetchErr } = await supabase
        .from('users')
        .select('id, full_name, phone')
        .eq('id', user.id)
        .maybeSingle();
      if (fetchErr) throw fetchErr;
      setProfile({ ...(data as UserProfile), email: user.email });
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل بيانات الملف الشخصي.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل تريد تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'خروج', style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/(auth)/welcome' as never);
        },
      },
    ]);
  };

  const comingSoon = (label: string) =>
    Alert.alert('قريباً', `ميزة "${label}" ستكون متاحة في التحديث القادم.`);

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'حسابي',
      items: [
        {
          label: 'معلوماتي الشخصية',
          icon: <User size={18} color={Colors.primary} />,
          color: Colors.primary,
          onPress: () => router.push('/(auth)/register' as never),
        },
        {
          label: 'ملفي الصحي',
          icon: <Heart size={18} color={Colors.error} />,
          color: Colors.error,
          onPress: () => comingSoon('ملفي الصحي'),
        },
        {
          label: 'محفظتي الصحية (التأمين)',
          icon: <Wallet size={18} color={Colors.success} />,
          color: Colors.success,
          onPress: () => comingSoon('محفظتي الصحية'),
        },
      ],
    },
    {
      title: 'الخدمات',
      items: [
        {
          label: 'تقاريري الطبية',
          icon: <FileText size={18} color={Colors.info} />,
          color: Colors.info,
          onPress: () => router.push('/(tabs)/sessions' as never),
        },
        {
          label: 'الإشعارات',
          icon: <Bell size={18} color={Colors.warning} />,
          color: Colors.warning,
          onPress: () => comingSoon('الإشعارات'),
        },
      ],
    },
    {
      title: 'الإعدادات',
      items: [
        {
          label: 'الأمان والخصوصية',
          icon: <Shield size={18} color={Colors.textSecondary} />,
          color: Colors.textSecondary,
          onPress: () => comingSoon('الأمان والخصوصية'),
        },
        {
          label: 'الإعدادات العامة',
          icon: <Settings size={18} color={Colors.textSecondary} />,
          color: Colors.textSecondary,
          onPress: () => comingSoon('الإعدادات العامة'),
        },
      ],
    },
  ];

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1, marginTop: 100 }} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0) ?? 'م'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name ?? 'المستخدم'}</Text>
        <Text style={styles.email}>{profile?.email ?? profile?.phone ?? ''}</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>تعديل الملف الشخصي</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Sections */}
      {menuSections.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, idx) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                    {item.icon}
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <ChevronRight size={16} color={Colors.textMuted} />
                </TouchableOpacity>
                {idx < section.items.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color={Colors.error} />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>

      <View style={styles.versionRow}>
        <Text style={styles.version}>مُعافى | MUAAFA v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  profileCard: {
    backgroundColor: Colors.primary, paddingTop: 60, paddingBottom: 28,
    alignItems: 'center', gap: 6,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  email: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.8)' },
  editBtn: {
    marginTop: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 18, paddingVertical: 6, borderRadius: Layout.radius.full,
  },
  editBtnText: { color: '#fff', fontSize: Typography.fontSize.sm },
  section: { padding: 12, paddingBottom: 0 },
  sectionTitle: {
    fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary, marginBottom: 6, paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: Colors.white, borderRadius: Layout.radius.lg, overflow: 'hidden', ...Layout.shadow.sm,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 12,
  },
  menuIcon: {
    width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: 14 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 12, marginTop: 16, backgroundColor: Colors.error + '10',
    borderRadius: Layout.radius.lg, padding: 14, justifyContent: 'center',
  },
  logoutText: { fontSize: Typography.fontSize.md, color: Colors.error, fontWeight: Typography.fontWeight.semibold },
  versionRow: { alignItems: 'center', paddingBottom: 24 },
  version: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
});
