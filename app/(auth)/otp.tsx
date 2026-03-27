import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, ShieldCheck } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { resolveUserPortal, PORTAL_HOME } from '@lib/authGuard';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Layout } from '@constants/layout';

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 60;

export default function OtpScreen() {
  // email is passed as a URL param: /(auth)/otp?email=user@example.com&type=signup
  const { email = '', type = 'signup' } = useLocalSearchParams<{ email: string; type: string }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    const clean = value.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...otp];
    updated[index] = clean;
    setOtp(updated);
    if (clean && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      Alert.alert('خطأ', 'يرجى إدخال رمز التحقق كاملاً');
      return;
    }
    if (!email) {
      Alert.alert('خطأ', 'البريد الإلكتروني مفقود. يرجى البدء من جديد.');
      router.replace('/(auth)/register' as never);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: type === 'recovery' ? 'recovery' : 'signup',
      });

      if (error) {
        Alert.alert('خطأ', 'رمز التحقق غير صحيح أو منتهي الصلاحية');
        return;
      }

      if (data?.user) {
        const portal = await resolveUserPortal(data.user.id);
        router.replace(PORTAL_HOME[portal] as never);
      }
    } catch {
      Alert.alert('خطأ', 'حدث خطأ أثناء التحقق. يرجى المحاولة مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !email) return;
    try {
      const { error } = await supabase.auth.resend({
        email,
        type: type === 'recovery' ? 'recovery' : 'signup',
      });
      if (error) throw error;
      setResendTimer(RESEND_TIMEOUT);
      Alert.alert('تم الإرسال', 'تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني');
    } catch {
      Alert.alert('خطأ', 'تعذر إعادة الإرسال. يرجى المحاولة لاحقاً.');
    }
  };

  const filledCount = otp.filter(d => d !== '').length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowRight size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <ShieldCheck size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>التحقق من الهوية</Text>
        <Text style={styles.subtitle}>
          أدخل رمز التحقق المكون من 6 أرقام الذي أُرسل إلى{'\n'}
          <Text style={{ fontWeight: 'bold', color: Colors.primary }}>{email || 'بريدك الإلكتروني'}</Text>
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <TextInput
              key={i}
              ref={ref => { inputs.current[i] = ref; }}
              style={[styles.otpBox, otp[i] ? styles.otpBoxFilled : null]}
              value={otp[i]}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyBtn, (loading || filledCount < OTP_LENGTH) && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={loading || filledCount < OTP_LENGTH}
        >
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.verifyBtnText}>تحقق</Text>}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>لم يصلك الرمز؟ </Text>
          <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
            <Text style={[styles.resendLink, resendTimer > 0 && styles.resendLinkDisabled]}>
              {resendTimer > 0 ? `إعادة الإرسال (${resendTimer}ث)` : 'إعادة الإرسال'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 16, width: 40 },
  content: { flex: 1, alignItems: 'center', paddingTop: 20 },
  iconWrap: {
    width: 90, height: 90, borderRadius: 24,
    backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary, marginBottom: 10,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 10,
  },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  otpBox: {
    width: 46, height: 54, borderRadius: Layout.radius.md,
    borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.white,
    fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary,
  },
  otpBoxFilled: { borderColor: Colors.primary },
  verifyBtn: {
    width: '100%', backgroundColor: Colors.primary, borderRadius: Layout.radius.lg,
    paddingVertical: 15, alignItems: 'center', ...Layout.shadow.md,
  },
  verifyBtnDisabled: { opacity: 0.5 },
  verifyBtnText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold },
  resendRow: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  resendLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  resendLink: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: Typography.fontWeight.semibold },
  resendLinkDisabled: { color: Colors.textMuted },
});
