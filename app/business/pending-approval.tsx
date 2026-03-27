import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, CheckCircle, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

export default function PendingApproval() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Clock size={48} color={Colors.warning} />
        </View>
        <Text style={styles.title}>طلبك قيد المراجعة</Text>
        <Text style={styles.subtitle}>
          تم استلام طلب تسجيل منشأتك بنجاح. يتم مراجعة الطلبات خلال 1-3 أيام عمل.
        </Text>
        <View style={styles.steps}>
          {[
            { icon: <CheckCircle size={18} color={Colors.success} />, label: 'تم تقديم الطلب', done: true },
            { icon: <Clock size={18} color={Colors.warning} />, label: 'مراجعة المستندات', done: false },
            { icon: <CheckCircle size={18} color={Colors.textMuted} />, label: 'الموافقة والتفعيل', done: false },
          ].map((step, i) => (
            <View key={i} style={styles.step}>
              {step.icon}
              <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>{step.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.noticeBox}>
          <Mail size={18} color={Colors.primary} />
          <Text style={styles.noticeText}>ستصلك رسالة بريد إلكتروني وإشعار عند اتخاذ قرار بشأن طلبك.</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)' as never)}>
        <Text style={styles.backText}>العودة للرئيسية</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 16 },
  card: {
    backgroundColor: Colors.white, borderRadius: Layout.radius['2xl'], padding: 24,
    alignItems: 'center', gap: 16, ...Layout.shadow.lg,
  },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.warning + '15', justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  steps: { alignSelf: 'stretch', gap: 12 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepLabel: { fontSize: Typography.fontSize.sm, color: Colors.textMuted },
  stepLabelDone: { color: Colors.textPrimary, fontWeight: Typography.fontWeight.medium },
  noticeBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: Colors.primary + '08',
    borderRadius: Layout.radius.lg, padding: 12, alignSelf: 'stretch',
  },
  noticeText: { flex: 1, fontSize: Typography.fontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  backBtn: {
    backgroundColor: Colors.primary, borderRadius: Layout.radius.lg, paddingVertical: 14,
    alignItems: 'center', marginTop: 16, ...Layout.shadow.md,
  },
  backText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
});
