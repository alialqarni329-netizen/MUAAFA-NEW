# إعداد قوالب الإيميل في Supabase

## الخطوات

### 1. فتح Supabase Dashboard
اذهب إلى: **Authentication → Email Templates**

### 2. رفع كل قالب

| نوع القالب | الملف | المكان في Dashboard |
|---|---|---|
| تأكيد التسجيل (OTP) | `confirmation.html` | Confirm signup |
| إعادة تعيين كلمة المرور | `recovery.html` | Reset Password |
| تغيير البريد الإلكتروني | `email-change.html` | Change Email Address |

### 3. Subject Lines (عناوين الإيميلات)

| النوع | العنوان |
|---|---|
| Confirm signup | `تأكيد حسابك في مُعافى ✅` |
| Reset Password | `إعادة تعيين كلمة المرور 🔐` |
| Change Email | `تأكيد تغيير بريدك الإلكتروني 📧` |

### 4. المتغيرات المستخدمة (Supabase Variables)

- `{{ .Token }}` — رمز OTP المكون من 6 أرقام
- `{{ .ConfirmationURL }}` — رابط التأكيد المباشر
- `{{ .Email }}` — البريد الإلكتروني للمستخدم
- `{{ .NewEmail }}` — البريد الجديد (في قالب تغيير البريد فقط)

### 5. تفعيل Email Confirmation

في **Authentication → Providers → Email**:
- ✅ Enable Email provider
- ✅ Confirm email
- ✅ Secure email change

---

> القوالب مصممة بهوية مُعافى: لون أزرق `#0ea5e9` مع دعم كامل للغة العربية (RTL)
