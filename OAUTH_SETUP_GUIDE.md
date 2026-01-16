# 🔐 دليل إعداد OAuth - MOODi Health

## 📅 التاريخ: 18 نوفمبر 2025

---

## ✅ ما تم تنفيذه

```
✅ Google OAuth - مُربوط بالكود
✅ Facebook OAuth - مُربوط بالكود
✅ X (Twitter) OAuth - مُربوط بالكود
```

**الحالة:** الكود جاهز، يحتاج فقط تفعيل في Supabase Dashboard

---

## 🎯 خطوات التفعيل

### 1️⃣ Google OAuth

#### أ. إنشاء Google OAuth App:

1. **اذهب إلى:** [Google Cloud Console](https://console.cloud.google.com/)
2. **أنشئ مشروع جديد** أو اختر موجود
3. **اذهب إلى:** APIs & Services > Credentials
4. **اضغط:** Create Credentials > OAuth 2.0 Client ID
5. **Application type:** Web application
6. **Authorized redirect URIs:**
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
7. **احفظ:**
   - Client ID
   - Client Secret

#### ب. تفعيل في Supabase:

1. **اذهب إلى:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **اختر مشروعك**
3. **اذهب إلى:** Authentication > Providers
4. **ابحث عن:** Google
5. **فعّل** Toggle
6. **أدخل:**
   - Client ID (من Google)
   - Client Secret (من Google)
7. **احفظ**

---

### 2️⃣ Facebook OAuth

#### أ. إنشاء Facebook App:

1. **اذهب إلى:** [Facebook Developers](https://developers.facebook.com/)
2. **اضغط:** My Apps > Create App
3. **اختر:** Consumer
4. **املأ التفاصيل**
5. **Settings > Basic:**
   - احفظ App ID
   - احفظ App Secret
6. **أضف منتج:** Facebook Login
7. **Valid OAuth Redirect URIs:**
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```

#### ب. تفعيل في Supabase:

1. **Supabase Dashboard > Authentication > Providers**
2. **Facebook** toggle
3. **أدخل:**
   - Facebook App ID
   - Facebook App Secret
4. **احفظ**

---

### 3️⃣ X (Twitter) OAuth

#### أ. إنشاء Twitter App:

1. **اذهب إلى:** [Twitter Developer Portal](https://developer.twitter.com/)
2. **اضغط:** Projects & Apps > Create App
3. **املأ التفاصيل**
4. **App Settings:**
   - احفظ API Key
   - احفظ API Secret Key
5. **Authentication Settings:**
   - Enable 3-legged OAuth
   - Callback URL:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```

#### ب. تفعيل في Supabase:

1. **Supabase Dashboard > Authentication > Providers**
2. **Twitter** toggle
3. **أدخل:**
   - API Key
   - API Secret Key
4. **احفظ**

---

## 🧪 الاختبار

### بعد التفعيل:

```
1. افتح التطبيق
2. اذهب لصفحة التسجيل أو الدخول
3. اضغط على أي زر OAuth (G, f, 𝕏)
4. سيفتح متصفح للمصادقة
5. سجل دخول بحسابك
6. السماح للتطبيق
7. العودة للتطبيق تلقائياً
8. ✅ تم تسجيل الدخول
```

---

## 📋 ملاحظات مهمة

### Redirect URLs:
```
⚠️ استبدل YOUR_PROJECT_REF بمرجع مشروعك الفعلي
⚠️ يمكن العثور عليه في: Supabase Settings > API
⚠️ مثال: https://abcdefghijklmn.supabase.co
```

### للتطوير المحلي:
```
قد تحتاج إضافة:
exp://localhost:8081
```

### للإنتاج:
```
استخدم domain الفعلي
مثال: https://app.moodihealth.sa
```

---

## 🔍 استكشاف الأخطاء

### "Provider not enabled"
```
✅ تأكد من تفعيل Provider في Supabase
✅ تأكد من إدخال Credentials صحيحة
✅ احفظ التغييرات
```

### "Redirect URL mismatch"
```
✅ تأكد من تطابق URL في:
   - Google/Facebook/Twitter Console
   - Supabase Dashboard
✅ تأكد من عدم وجود مسافات زائدة
```

### "Invalid credentials"
```
✅ تحقق من Client ID/Secret
✅ تحقق من API Key/Secret
✅ تأكد من نسخها بشكل صحيح
```

---

## 🎯 الحالة الحالية

| Platform | كود التطبيق | Supabase Config | الحالة |
|----------|-------------|-----------------|--------|
| Google | ✅ جاهز | ⏳ يحتاج إعداد | 🟡 |
| Facebook | ✅ جاهز | ⏳ يحتاج إعداد | 🟡 |
| X (Twitter) | ✅ جاهز | ⏳ يحتاج إعداد | 🟡 |

---

## 💡 نصائح

```
✅ اختبر كل provider على حدة
✅ استخدم حسابات اختبار أولاً
✅ راجع السجلات في Supabase
✅ تأكد من HTTPS في الإنتاج
```

---

## 📚 موارد إضافية

- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Setup](https://console.cloud.google.com/)
- [Facebook App Console](https://developers.facebook.com/)
- [Twitter Developer Portal](https://developer.twitter.com/)

---

**التحديث:** 18 نوفمبر 2025
**الحالة:** ✅ **الكود جاهز - يحتاج تفعيل**
