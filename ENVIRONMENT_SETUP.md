# ⚙️ دليل إعداد البيئة الكاملة
# Complete Environment Setup Guide

## 🎯 الهدف | Goal

دليل شامل لإعداد بيئة التطوير الكاملة لمشروع Muaafa Health على أي جهاز جديد.

---

## 📋 المتطلبات الأساسية | Prerequisites

### نظام التشغيل | Operating System:
- ✅ macOS (10.15 أو أحدث)
- ✅ Windows 10/11
- ✅ Linux (Ubuntu 20.04 أو أحدث)

### الأدوات الأساسية | Essential Tools:
- Node.js v18.0.0 أو أحدث
- npm v9.0.0 أو أحدث (يأتي مع Node.js)
- Git v2.30 أو أحدث
- محرر كود (VS Code موصى به)

---

## 🔧 الإعداد خطوة بخطوة | Step-by-Step Setup

## الخطوة 1: تثبيت Node.js و npm

### macOS:

#### الطريقة 1: باستخدام Homebrew (موصى به)
```bash
# تثبيت Homebrew إذا لم يكن مثبتاً
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# تثبيت Node.js
brew install node

# التحقق
node --version  # يجب أن يكون v18 أو أحدث
npm --version
```

#### الطريقة 2: من الموقع الرسمي
1. اذهب لـ [nodejs.org](https://nodejs.org/)
2. حمّل النسخة LTS
3. ثبّت الحزمة
4. أعد تشغيل Terminal

### Windows:

#### الطريقة 1: من الموقع الرسمي (موصى به)
1. اذهب لـ [nodejs.org](https://nodejs.org/)
2. حمّل Windows Installer (.msi)
3. شغّل الملف واتبع التعليمات
4. ✅ فعّل "Automatically install necessary tools"
5. أعد تشغيل Command Prompt

#### الطريقة 2: باستخدام Chocolatey
```powershell
# في PowerShell كـ Administrator
choco install nodejs-lts

# التحقق
node --version
npm --version
```

### Linux (Ubuntu/Debian):

```bash
# تحديث الحزم
sudo apt update

# تثبيت Node.js من NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# التحقق
node --version
npm --version
```

---

## الخطوة 2: تثبيت Git

### macOS:

```bash
# باستخدام Homebrew
brew install git

# أو يأتي مع Xcode Command Line Tools
xcode-select --install

# التحقق
git --version
```

### Windows:

1. اذهب لـ [git-scm.com](https://git-scm.com/download/win)
2. حمّل Git for Windows
3. ثبّت بالإعدادات الافتراضية
4. اختر "Git from the command line and also from 3rd-party software"
5. أعد تشغيل Command Prompt

```powershell
# التحقق
git --version
```

### Linux:

```bash
sudo apt install git

# التحقق
git --version
```

---

## الخطوة 3: إعداد Git

```bash
# أضف اسمك وإيميلك
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# محرر افتراضي (اختياري)
git config --global core.editor "code --wait"  # لـ VS Code

# التحقق من الإعدادات
git config --list
```

---

## الخطوة 4: تثبيت VS Code (موصى به)

### جميع الأنظمة:
1. اذهب لـ [code.visualstudio.com](https://code.visualstudio.com/)
2. حمّل النسخة المناسبة لنظامك
3. ثبّت البرنامج

### Extensions الموصى بها:

افتح VS Code واضغط `Ctrl+Shift+X` (أو `Cmd+Shift+X` في Mac) وثبّت:

```
- ESLint
- Prettier - Code formatter
- React Native Tools
- ES7+ React/Redux/React-Native snippets
- GitLens
- Path Intellisense
- Auto Rename Tag
- Bracket Pair Colorizer 2
- Material Icon Theme
```

أو ثبّتها عبر Terminal:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension msjsdiag.vscode-react-native
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension eamodio.gitlens
code --install-extension christian-kohler.path-intellisense
code --install-extension formulahendry.auto-rename-tag
code --install-extension coenraads.bracket-pair-colorizer-2
code --install-extension pkief.material-icon-theme
```

---

## الخطوة 5: تثبيت Expo CLI (اختياري للتطوير)

```bash
# تثبيت عالمي
npm install -g expo-cli

# التحقق
expo --version
```

---

## الخطوة 6: تثبيت Supabase CLI

```bash
# تثبيت عالمي
npm install -g supabase

# التحقق
supabase --version

# تسجيل دخول (ستحتاجه لاحقاً)
supabase login
```

---

## الخطوة 7: تثبيت PostgreSQL Client (للنسخ الاحتياطية)

### macOS:
```bash
brew install postgresql
```

### Windows:
1. حمّل من [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. ثبّت PostgreSQL
3. أضف `C:\Program Files\PostgreSQL\15\bin` للـ PATH

### Linux:
```bash
sudo apt install postgresql-client
```

التحقق:
```bash
psql --version
pg_dump --version
```

---

## الخطوة 8: استنساخ المشروع

```bash
# انتقل للمجلد المطلوب
cd ~/Projects  # أو أي مجلد تفضله

# Clone المشروع
git clone https://github.com/YOUR_USERNAME/muaafa-health-app.git

# انتقل لمجلد المشروع
cd muaafa-health-app

# تحقق من الـ branch
git branch
# يجب أن ترى: * main
```

---

## الخطوة 9: تثبيت مكتبات المشروع

```bash
# تأكد أنك داخل مجلد المشروع
cd muaafa-health-app

# تثبيت جميع المكتبات
npm install

# إذا واجهت مشاكل، جرب:
npm install --legacy-peer-deps

# أو
npm ci  # للتثبيت من package-lock.json بدقة
```

### في حال وجود أخطاء:

```bash
# امسح كل شيء وأعد المحاولة
rm -rf node_modules package-lock.json
npm install
```

---

## الخطوة 10: إنشاء ملف `.env`

```bash
# انسخ من المثال
cp .env.example .env

# افتح الملف
code .env  # في VS Code
# أو
nano .env  # في Terminal
```

املأ المتغيرات:
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key

# Zoom API Configuration
ZOOM_ACCOUNT_ID=your_zoom_account_id
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
```

---

## الخطوة 11: إعداد Supabase

### إنشاء مشروع جديد:

1. اذهب لـ [supabase.com/dashboard](https://supabase.com/dashboard)
2. سجل دخول أو أنشئ حساب
3. اضغط **"New project"**
4. املأ:
   - **Organization**: اختر أو أنشئ
   - **Name**: `Muaafa Health`
   - **Database Password**: كلمة مرور قوية (احفظها!)
   - **Region**: اختر أقرب منطقة
   - **Pricing Plan**: Free للتطوير
5. اضغط **"Create new project"**
6. انتظر ~2 دقيقة

### الحصول على المفاتيح:

1. **Settings** > **API**
2. انسخ:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. ضعها في ملف `.env`

### استيراد قاعدة البيانات:

```bash
# ربط المشروع
supabase link --project-ref YOUR_PROJECT_ID

# استيراد الـ schema
supabase db push

# أو عبر psql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres" \
  < supabase_schema.sql
```

### رفع Edge Functions:

```bash
# رفع كل الـ functions
supabase functions deploy create-meeting
supabase functions deploy test-zoom-connection
supabase functions deploy health-chatbot
supabase functions deploy send-welcome-email
supabase functions deploy check-subscriptions
supabase functions deploy generate-medical-brief
supabase functions deploy simplify-medical-report
```

### إضافة Secrets:

1. **Settings** > **Secrets**
2. أضف:
   - `ZOOM_ACCOUNT_ID`
   - `ZOOM_CLIENT_ID`
   - `ZOOM_CLIENT_SECRET`
   - `OPENAI_API_KEY`

---

## الخطوة 12: الحصول على API Keys

### OpenAI:
1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. سجل دخول
3. **"Create new secret key"**
4. احفظ المفتاح في `.env`

### Zoom:
راجع [ZOOM_SETUP_GUIDE.md](ZOOM_SETUP_GUIDE.md) للتفاصيل الكاملة

باختصار:
1. [marketplace.zoom.us](https://marketplace.zoom.us/)
2. **Develop** > **Build App**
3. **Server-to-Server OAuth**
4. احصل على المفاتيح من **App Credentials**

---

## الخطوة 13: تشغيل المشروع

```bash
# تأكد أنك في مجلد المشروع
cd muaafa-health-app

# تشغيل
npm run dev

# أو للويب فقط
npm run dev -- --web
```

سترى:
```
› Metro waiting on exp://192.168.1.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

اضغط `w` لفتح في المتصفح!

---

## 🧪 اختبار الإعداد | Test Setup

### 1. اختبار Node.js:
```bash
node --version  # v18.0.0+
npm --version   # 9.0.0+
```

### 2. اختبار Git:
```bash
git --version
git config user.name
git config user.email
```

### 3. اختبار المشروع:
```bash
cd muaafa-health-app
npm run dev
```

### 4. اختبار Supabase:
في المتصفح، جرب تسجيل مستخدم جديد

### 5. اختبار Zoom:
**الإعدادات** > **اختبار اتصال Zoom**

---

## 🔧 إعدادات VS Code الموصى بها

أنشئ `.vscode/settings.json` في المشروع:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/.expo": true,
    "**/.expo-shared": true,
    "**/node_modules": true
  }
}
```

---

## 📱 إعداد الأجهزة للتطوير | Device Setup

### Android:

1. ثبّت **Expo Go** من Google Play Store
2. افتح التطبيق
3. امسح QR code من Terminal

### iOS:

1. ثبّت **Expo Go** من App Store
2. افتح Camera app
3. امسح QR code من Terminal

### Web:

اضغط `w` في Terminal أو افتح:
```
http://localhost:8081
```

---

## 🐛 حل المشاكل الشائعة | Troubleshooting

### مشكلة: `command not found: node`
**الحل**: أضف Node.js للـ PATH أو أعد تشغيل Terminal

### مشكلة: `EACCES: permission denied`
**الحل** (Linux/Mac):
```bash
sudo chown -R $USER /usr/local/lib/node_modules
```

### مشكلة: `Module not found`
**الحل**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### مشكلة: `Port 8081 already in use`
**الحل**:
```bash
# قتل العملية
npx kill-port 8081

# أو غيّر البورت
REACT_NATIVE_PACKAGER_PORT=8082 npm run dev
```

### مشكلة: Expo Go لا يتصل
**الحل**:
- تأكد من وجود الجهاز والكمبيوتر على نفس الشبكة
- جرب استخدام Tunnel mode:
```bash
npx expo start --tunnel
```

---

## ✅ Checklist الإعداد الكامل | Complete Setup Checklist

- [ ] Node.js v18+ مثبت
- [ ] npm v9+ مثبت
- [ ] Git مثبت ومضبوط
- [ ] VS Code مثبت مع Extensions
- [ ] Expo CLI مثبت
- [ ] Supabase CLI مثبت ومسجل دخول
- [ ] PostgreSQL Client مثبت
- [ ] المشروع مستنسخ من GitHub
- [ ] `npm install` نجح
- [ ] ملف `.env` مضبوط بالمفاتيح
- [ ] Supabase project جاهز
- [ ] قاعدة البيانات مستوردة
- [ ] Edge Functions مرفوعة
- [ ] Secrets مضبوطة في Supabase
- [ ] `npm run dev` يعمل
- [ ] التطبيق يفتح في المتصفح/جهاز
- [ ] تسجيل دخول يعمل
- [ ] اختبار Zoom ناجح

---

## 🎓 الخطوات التالية | Next Steps

بعد الإعداد الناجح:

1. **راجع التوثيق**:
   - [README.md](README.md) - نظرة شاملة
   - [START_HERE.md](START_HERE.md) - البداية
   - جميع ملفات `*.md` الأخرى

2. **جرب الميزات**:
   - سجل مستخدم جديد
   - احجز موعد
   - جرب الطبيب الذكي
   - اختبر الصيدليات

3. **ابدأ التطوير**:
   - راجع [PROJECT_MIGRATION_GUIDE.md](PROJECT_MIGRATION_GUIDE.md)
   - راجع بنية المشروع في `app/`
   - ابدأ بإضافة ميزات جديدة!

---

## 📞 المساعدة | Getting Help

إذا واجهت مشاكل:

1. راجع [Troubleshooting](#-حل-المشاكل-الشائعة--troubleshooting)
2. ابحث في [GitHub Issues](https://github.com/YOUR_USERNAME/muaafa-health-app/issues)
3. راجع التوثيق الرسمي:
   - [Expo Docs](https://docs.expo.dev/)
   - [Supabase Docs](https://supabase.com/docs)
   - [React Native Docs](https://reactnative.dev/)

---

**🎉 تهانينا! بيئتك جاهزة للتطوير!**

ابدأ الآن بـ `npm run dev` واستمتع بالتطوير! 🚀
