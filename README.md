# مُعافى | MUAAFA
### منصة الخدمات الصحية والطبية المتكاملة

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey)
![License](https://img.shields.io/badge/license-Private-red)

</div>

---

## نظرة عامة

**مُعافى (MUAAFA)** هي منصة صحية متكاملة تربط الأفراد بمقدمي الرعاية الصحية، وتوفر خدمات طبية ذكية بما في ذلك:

- طبيب ذكي مدعوم بالذكاء الاصطناعي (OpenAI GPT)
- حجز جلسات طبية مع أطباء معتمدين
- طلب الأدوية من الصيدليات
- تتبع التغطية التأمينية
- بوابة لإدارة مقدمي الخدمات الصحية
- لوحة تحكم إدارية شاملة للمالك

---

## هيكل المشروع

```
muaafa-new/
├── app/                          # صفحات التطبيق (Expo Router)
│   ├── _layout.tsx               # Root Layout
│   ├── (auth)/                   # صفحات المصادقة
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── otp.tsx
│   ├── (tabs)/                   # بوابة الأفراد (Tab Navigation)
│   │   ├── index.tsx             # الطبيب الذكي
│   │   ├── fitness.tsx           # اللياقة البدنية
│   │   ├── pharmacies.tsx        # الصيدليات
│   │   ├── sessions.tsx          # جلساتي
│   │   └── profile.tsx          # حسابي
│   ├── business/                 # بوابة الأعمال
│   │   ├── (tabs)/               # Tab navigation للأعمال
│   │   ├── register.tsx
│   │   └── pending-approval.tsx
│   └── owner/                    # بوابة المالك (الإدارة)
│       ├── dashboard/
│       ├── users/
│       ├── business-mgmt/
│       ├── payments/
│       ├── analytics/
│       └── settings/
├── components/                   # مكونات قابلة لإعادة الاستخدام
│   ├── common/                   # مشتركة بين البوابات
│   ├── individual/               # خاصة ببوابة الأفراد
│   ├── business/                 # خاصة ببوابة الأعمال
│   └── owner/                    # خاصة ببوابة المالك
├── lib/
│   └── supabase.ts               # Supabase client
├── hooks/
│   ├── useAuth.ts                # مصادقة المستخدم
│   ├── useRealtime.ts            # Real-time subscriptions
│   └── useUserProfile.ts         # بيانات المستخدم
├── constants/
│   ├── colors.ts                 # نظام الألوان
│   ├── typography.ts             # الخطوط والأحجام
│   └── layout.ts                 # التخطيط والمسافات
├── types/
│   └── database.ts               # TypeScript types لقاعدة البيانات
├── .github/
│   └── workflows/
│       ├── ci.yml                # Pipeline التحقق والجودة
│       └── eas-build.yml         # Pipeline البناء للإنتاج
├── app.json                      # إعدادات Expo
├── eas.json                      # إعدادات EAS Build
├── package.json                  # التبعيات والأوامر
├── tsconfig.json                 # إعدادات TypeScript
├── babel.config.js               # إعدادات Babel
├── .eslintrc.js                  # قواعد جودة الكود
├── .prettierrc                   # تنسيق الكود
└── .env.example                  # مثال متغيرات البيئة
```

---

## المتطلبات الأساسية

- **Node.js** 20+
- **npm** 10+
- **Expo CLI** + **EAS CLI**
- حساب **Supabase** مع قاعدة بيانات جاهزة
- مفتاح **OpenAI API** للطبيب الذكي

---

## الإعداد والتشغيل

### 1. نسخ المستودع
```bash
git clone https://github.com/alialqarni329-netizen/muaafa-new.git
cd muaafa-new
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد متغيرات البيئة
```bash
cp .env.example .env
# ثم افتح .env وأضف مفاتيحك الحقيقية
```

متغيرات البيئة المطلوبة:
| المتغير | الوصف | مطلوب |
|---------|-------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase | ✅ |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | مفتاح Supabase العام | ✅ |
| `EXPO_PUBLIC_OPENAI_API_KEY` | مفتاح OpenAI للطبيب الذكي | ✅ |
| `ZOOM_ACCOUNT_ID` | حساب Zoom للجلسات المرئية | اختياري |
| `ZOOM_CLIENT_ID` | معرف تطبيق Zoom | اختياري |
| `ZOOM_CLIENT_SECRET` | كلمة سر Zoom | اختياري |

> ⚠️ **تحذير أمني**: لا ترفع ملف `.env` إلى Git أبداً!

### 4. تشغيل التطبيق
```bash
# للتطوير
npm start

# للويب
npm run web

# لـ Android
npm run android

# لـ iOS
npm run ios
```

---

## أوامر مفيدة

```bash
# فحص جودة الكود
npm run lint

# إصلاح أخطاء الكود تلقائياً
npm run lint:fix

# فحص TypeScript
npm run typecheck

# تنسيق الكود
npm run format

# تشغيل الاختبارات
npm test
```

---

## البناء للإنتاج

```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول لـ Expo
eas login

# بناء للمعاينة (Android APK)
eas build --platform android --profile preview

# بناء للإنتاج
eas build --platform all --profile production

# رفع لمتاجر التطبيقات
eas submit --platform all
```

---

## GitHub Secrets المطلوبة

لـ CI/CD Pipeline، أضف هذه الأسرار في إعدادات GitHub:

| Secret | الوصف |
|--------|-------|
| `EXPO_PUBLIC_SUPABASE_URL` | رابط Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | مفتاح Supabase |
| `EXPO_TOKEN` | رمز Expo للبناء التلقائي |

---

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **React Native + Expo** | إطار التطبيق |
| **TypeScript** | أمان الأنواع |
| **Expo Router** | التنقل بين الصفحات |
| **Supabase** | قاعدة البيانات + المصادقة + Real-time |
| **OpenAI GPT** | الطبيب الذكي |
| **ZedPay** | بوابة الدفع السعودية |
| **Zoom API** | الجلسات الطبية المرئية |
| **GitHub Actions** | CI/CD Pipeline |
| **EAS** | بناء ورفع التطبيق |

---

## التوثيق

راجع ملفات التوثيق التفصيلية:

| الملف | المحتوى |
|-------|---------|
| `DEPLOYMENT_GUIDE.md` | دليل النشر الكامل |
| `DATABASE_INTEGRATION_COMPLETE_REPORT.md` | تقرير قاعدة البيانات |
| `AI_INTEGRATION.md` | دمج الذكاء الاصطناعي |
| `BUSINESS_PORTAL_COMPLETE_GUIDE.md` | بوابة الأعمال |
| `HEALTH_WALLET_SYSTEM.md` | نظام المحفظة الصحية |
| `NOTIFICATIONS_SYSTEM_GUIDE.md` | نظام الإشعارات |

---

## حالة المشروع

| البوابة | الحالة |
|---------|--------|
| بوابة الأفراد | ✅ مكتملة 100% |
| بوابة الأعمال | ✅ مكتملة 100% |
| بوابة المالك | ✅ مكتملة 100% |
| قاعدة البيانات | ✅ 97+ جدول |
| CI/CD | ✅ مفعّل |

---

*مُعافى | MUAAFA © 2026 - جميع الحقوق محفوظة*
