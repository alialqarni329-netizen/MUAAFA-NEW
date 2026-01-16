# دليل النشر عبر EAS (Expo Application Services)

## ✅ الإعداد مكتمل

تم إعداد المشروع للنشر عبر EAS. الملفات التالية جاهزة:
- ✅ `eas.json` - إعدادات البناء
- ✅ `app.json` - معلومات المشروع والـ Project ID

---

## 🚀 خطوات النشر

### 1️⃣ تسجيل الدخول

```bash
npx eas-cli login
```

أدخل:
- Email أو Username الخاص بحساب Expo
- Password

---

### 2️⃣ إنشاء Build للتطوير (اختياري)

```bash
# iOS Development Build
npx eas-cli build --profile development --platform ios

# Android Development Build
npx eas-cli build --profile development --platform android
```

---

### 3️⃣ إنشاء Build للإنتاج

```bash
# iOS Production Build
npx eas-cli build --profile production --platform ios

# Android Production Build
npx eas-cli build --profile production --platform android

# بناء المنصتين معاً
npx eas-cli build --profile production --platform all
```

---

### 4️⃣ رفع التطبيق إلى المتاجر

```bash
# رفع لـ App Store (iOS)
npx eas-cli submit --platform ios

# رفع لـ Google Play (Android)
npx eas-cli submit --platform android
```

---

## 📋 Profiles المتاحة

### Development
- للتطوير والاختبار
- يتضمن Development Client
- توزيع داخلي (Internal)

### Preview
- للمراجعة قبل الإطلاق
- APK لـ Android
- توزيع داخلي (Internal)

### Production
- للإصدار النهائي
- جاهز للنشر في المتاجر
- Auto-increment للإصدارات

---

## 🔑 معلومات المشروع

- **Project ID:** `d117af0f-3a43-49fd-a80f-330a31f44178`
- **Bundle ID (iOS):** `com.muaafa.health`
- **Package Name (Android):** `com.muaafa.health`
- **Owner:** `muaafa-health`

---

## 📱 متطلبات النشر

### iOS (App Store)
1. حساب Apple Developer ($99/سنة)
2. Apple App Store Connect API Key
3. Distribution Certificate
4. Provisioning Profile

### Android (Google Play)
1. حساب Google Play Developer ($25 مرة واحدة)
2. Service Account JSON Key
3. App Signing Key

---

## 🛠️ أوامر إضافية مفيدة

```bash
# عرض جميع الـ Builds
npx eas-cli build:list

# عرض حالة Build معين
npx eas-cli build:view [BUILD_ID]

# إعداد Credentials
npx eas-cli credentials

# تحديث المشروع
npx eas-cli update

# عرض معلومات المشروع
npx eas-cli project:info
```

---

## 📊 مراقبة الـ Build

بعد بدء الـ Build:
1. سيتم عرض رابط لمتابعة التقدم
2. افتح الرابط في المتصفح
3. راقب logs والحالة
4. عند الانتهاء، ستحصل على ملف IPA (iOS) أو APK/AAB (Android)

---

## ⚠️ ملاحظات مهمة

### قبل أول Build:

1. **أضف الأيقونات:**
   - `./assets/images/icon.png` (1024x1024)
   - `./assets/images/splash.png` (1284x2778)
   - `./assets/images/adaptive-icon.png` (Android)
   - `./assets/images/favicon.png` (Web)

2. **تأكد من المتغيرات البيئية:**
   ```bash
   npx eas-cli secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "YOUR_URL"
   npx eas-cli secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_KEY"
   ```

3. **راجع الأذونات في `app.json`:**
   - ✅ CAMERA
   - ✅ LOCATION
   - ✅ NOTIFICATIONS

---

## 🔗 روابط مفيدة

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [EAS Dashboard](https://expo.dev/accounts/muaafa-health/projects/muaafa-health)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console/)

---

## 🎯 الخطوة التالية

```bash
# سجل دخول وابدأ أول Build!
npx eas-cli login
npx eas-cli build --profile production --platform all
```

🚀 **بالتوفيق في إطلاق التطبيق!**
