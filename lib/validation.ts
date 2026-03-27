/**
 * Zod validation schemas for all user-facing forms.
 * Use `schema.safeParse(data)` to validate; returns { success, error } or { success, data }.
 */
import { z } from 'zod';

// ── Helpers ────────────────────────────────────────────────────────────────

const saudiPhone = z
  .string()
  .min(10, 'رقم الجوال يجب أن يكون 10 أرقام على الأقل')
  .regex(/^(05|5)\d{8}$/, 'يرجى إدخال رقم جوال سعودي صحيح (05xxxxxxxx)');

const email = z
  .string()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('يرجى إدخال بريد إلكتروني صحيح');

const password = z
  .string()
  .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
  .max(72, 'كلمة المرور طويلة جداً');

// ── Auth Schemas ───────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email,
  password,
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(60),
  phone: saudiPhone,
  email,
  password,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ── Business Registration Schema ───────────────────────────────────────────

export const businessRegisterSchema = z.object({
  businessName: z.string().min(3, 'اسم المنشأة يجب أن يكون 3 أحرف على الأقل').max(80),
  businessType: z.string().min(1, 'يرجى اختيار نوع المنشأة'),
  ownerName: z.string().min(3, 'اسم المالك يجب أن يكون 3 أحرف على الأقل'),
  phone: saudiPhone,
  email,
  address: z.string().min(5, 'يرجى إدخال العنوان').max(200),
  licenseNumber: z.string().optional(),
});
export type BusinessRegisterInput = z.infer<typeof businessRegisterSchema>;

// ── Employee Schema ────────────────────────────────────────────────────────

export const addEmployeeSchema = z.object({
  full_name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(60),
  email: z.string().email('بريد إلكتروني غير صحيح').or(z.literal('')),
  phone: z.string().optional(),
  role: z.enum(['doctor', 'nurse', 'admin', 'pharmacist', 'receptionist'], {
    errorMap: () => ({ message: 'يرجى اختيار الدور الوظيفي' }),
  }),
});
export type AddEmployeeInput = z.infer<typeof addEmployeeSchema>;

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the first error message from a Zod error, or null if valid.
 * Usage: const err = getFirstError(schema.safeParse(data));
 */
export function getFirstError(result: z.SafeParseReturnType<unknown, unknown>): string | null {
  if (result.success) return null;
  return result.error.issues[0]?.message ?? 'خطأ في التحقق';
}

/**
 * Returns a field → message map from a Zod error.
 * Usage: const errors = getFieldErrors(schema.safeParse(data));
 */
export function getFieldErrors(
  result: z.SafeParseReturnType<unknown, unknown>,
): Record<string, string> {
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map(e => [e.path.join('.'), e.message]),
  );
}
