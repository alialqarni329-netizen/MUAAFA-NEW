# 🔴 إصلاح خطأ Google OAuth

## 🚨 الخطأ:
```json
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

---

## ✅ السبب والحل

### السبب:
**Google OAuth غير مفعّل في Supabase Dashboard**

### الحل (5 دقائق فقط):

---

## 📋 الخطوات بالتفصيل الممل:

### الخطوة 1: افتح Supabase Dashboard

```
1. افتح المتصفح
2. اذهب لـ: https://supabase.com/dashboard
3. سجّل دخول بحسابك
4. اختر المشروع: tmkkmzrmtjctchfxseoh
```

---

### الخطوة 2: اذهب لإعدادات Authentication

```
1. في القائمة اليسرى (sidebar)
2. اضغط على: "Authentication" (أيقونة قفل)
3. ثم اضغط على: "Providers"
```

---

### الخطوة 3: ابحث عن Google

```
1. scroll للأسفل
2. ابحث عن: "Google"
3. اضغط على صف "Google"
```

---

### الخطوة 4: فعّل Google OAuth

```
سيفتح لك modal/صفحة بها:

☐ Enable Sign in with Google

اضغط على Toggle لتفعيله ✅
```

---

### الخطوة 5: أدخل Google Credentials

**سيطلب منك:**
- Client ID (OAuth 2.0)
- Client Secret (OAuth 2.0)

---

## 🔑 كيف تحصل على Google Credentials؟

### الطريقة السريعة (15 دقيقة):

#### 1. اذهب لـ Google Cloud Console
```
https://console.cloud.google.com/
```

#### 2. أنشئ Project جديد أو اختر موجود
```
- اضغط القائمة العلوية
- Select a project
- NEW PROJECT
- اسم المشروع: MOODi Health
- Create
```

#### 3. فعّل Google+ API
```
- من القائمة: APIs & Services > Library
- ابحث عن: Google+ API
- اضغط عليها
- Enable
```

#### 4. أنشئ OAuth 2.0 Credentials
```
- من القائمة: APIs & Services > Credentials
- اضغط: + CREATE CREDENTIALS
- اختر: OAuth 2.0 Client ID
```

#### 5. Configure Consent Screen (أول مرة)
```
إذا طلب منك Configure Consent Screen:

1. User Type: External
2. Create
3. App information:
   - App name: MOODi Health
   - User support email: بريدك
   - Developer contact: بريدك
4. Save and Continue
5. Scopes: اترك default > Save and Continue
6. Test users: أضف بريدك > Save and Continue
7. Summary: Back to Dashboard
```

#### 6. أنشئ OAuth Client ID
```
- ارجع لـ: Credentials > Create Credentials > OAuth Client ID
- Application type: Web application
- Name: MOODi Health Web
- Authorized redirect URIs:
  اضغط "+ Add URI" وأدخل:
  
  https://tmkkmzrmtjctchfxseoh.supabase.co/auth/v1/callback
  
  ⚠️ مهم جداً: انسخه بالضبط بدون / في النهاية
  
- Create
```

#### 7. احفظ Credentials
```
سيظهر لك:

✅ Client ID: xxxxxxxxxx.apps.googleusercontent.com
✅ Client Secret: GOCSPX-xxxxxxxxxxxx

انسخهم!
```

---

### الخطوة 6: ألصق Credentials في Supabase

```
1. ارجع لـ Supabase Dashboard
2. Authentication > Providers > Google
3. ألصق:
   - Client ID: (من Google Cloud)
   - Client Secret: (من Google Cloud)
4. Authorized Client IDs: اتركه فاضي
5. Skip nonce check: اتركه false
6. اضغط: Save
```

---

## 🧪 اختبار

### بعد الحفظ:

```
1. ✅ Google مفعّل في Supabase
2. ✅ Client ID و Secret مُدخلين
3. افتح التطبيق (MOODi Health)
4. اضغط زر "التسجيل عبر Google" [G]
5. سيفتح متصفح Google
6. اختر حسابك
7. اسمح للصلاحيات
8. ✅ سيرجعك للتطبيق
9. ✅ "نجح! تم تسجيل الدخول بنجاح"
10. ✅ دخلت!
```

---

## 🔧 Troubleshooting

### خطأ: "redirect_uri_mismatch"

```
السبب: الـ Redirect URI غلط

الحل:
1. Google Cloud Console
2. Credentials > OAuth 2.0 Client IDs
3. اضغط على الـ Client اللي أنشأته
4. Authorized redirect URIs
5. تأكد أنه مكتوب بالضبط:
   https://tmkkmzrmtjctchfxseoh.supabase.co/auth/v1/callback
6. Save
7. انتظر دقيقتين
8. جرّب مرة ثانية
```

### خطأ: "invalid_client"

```
السبب: Client ID أو Secret غلط

الحل:
1. راجع Supabase Dashboard
2. تأكد من Client ID و Secret
3. قارنهم مع Google Cloud Console
4. إذا مختلفين، صحّحهم
5. Save
```

### خطأ: "Access blocked"

```
السبب: حسابك مو في Test Users

الحل:
1. Google Cloud Console
2. OAuth consent screen
3. Test users
4. + ADD USERS
5. أضف بريدك
6. Save
```

---

## ⚡ ملخص سريع

```
المشكلة: Google OAuth غير مفعّل

الحل:
1. Google Cloud Console
2. أنشئ OAuth 2.0 Client ID
3. Redirect URI: 
   https://tmkkmzrmtjctchfxseoh.supabase.co/auth/v1/callback
4. احفظ Client ID + Secret
5. Supabase Dashboard > Authentication > Providers > Google
6. ألصق Credentials
7. Save
8. ✅ اختبر!

الوقت: 15-20 دقيقة
```

---

## 🎯 Checklist

قبل الاختبار:

```
☐ Google Cloud Project موجود
☐ Google+ API مفعّل
☐ OAuth 2.0 Client ID موجود
☐ Redirect URI صحيح بالضبط
☐ Client ID و Secret محفوظين
☐ Supabase > Google Provider مفعّل
☐ Client ID و Secret مُدخلين في Supabase
☐ حفظت التغييرات
☐ انتظرت دقيقتين
```

بعدها:
```
✅ افتح التطبيق
✅ اضغط زر Google
✅ المفروض يشتغل!
```

---

## 📞 إذا ما زال ما يشتغل

### جرّب هذي:

```
1. تأكد من Redirect URI مرة ثانية
2. تأكد من Client ID و Secret
3. انتظر 5 دقائق (Google تحتاج وقت)
4. clear cache التطبيق
5. جرّب مرة ثانية
```

### بدائل للاختبار الفوري:

```
✅ تسجيل دخول بالبريد والباسورد (يشتغل الآن)
✅ تسجيل دخول برقم الهاتف + OTP (يحتاج Twilio)
```

---

## 🎉 بعد النجاح

```
✅ Google OAuth يشتغل
✅ تسجيل دخول سريع
✅ تجربة مستخدم ممتازة
✅ آمن 100%
```

---

**⏱️ الوقت:** 15-20 دقيقة فقط
**🎯 المطلوب:** تفعيل Google في Supabase + Google Cloud
**📊 النجاح:** مضمون 100% إذا اتبعت الخطوات
