# 📦 دليل إعداد Git و GitHub
# Git & GitHub Setup Guide

## 🎯 الهدف | Goal

هذا الدليل يساعدك على:
- ✅ ربط المشروع بـ GitHub repository
- ✅ دفع الكود بشكل منتظم
- ✅ تسهيل مشاركة المشروع مع مطورين آخرين
- ✅ عمل نسخ احتياطية تلقائية

---

## 🚀 الإعداد الأولي | Initial Setup

### 1. إنشاء GitHub Repository جديد

#### عبر الموقع:
1. اذهب إلى [GitHub](https://github.com)
2. سجل دخول بحسابك
3. اضغط على **"New repository"** أو زر **"+"** في الأعلى
4. املأ البيانات:
   - **Repository name**: `muaafa-health-app`
   - **Description**: `Muaafa Health - منصة طبية متكاملة`
   - **Visibility**: اختر **Private** (خاص) أو **Public** (عام)
   - ❌ **لا تُفعّل** "Initialize with README" (لأن المشروع موجود بالفعل)
5. اضغط **"Create repository"**
6. **احتفظ بالصفحة مفتوحة** - سنحتاج الرابط

---

### 2. ربط المشروع المحلي بـ GitHub

#### في Terminal/Command Line:

```bash
# 1. انتقل لمجلد المشروع
cd /path/to/muaafa-health-app

# 2. تأكد من وجود Git (إذا لم يكن موجوداً، قم بتهيئته)
git init

# 3. أضف جميع الملفات
git add .

# 4. أول commit
git commit -m "Initial commit: Muaafa Health App - Complete setup"

# 5. أضف remote repository (استبدل YOUR_USERNAME باسم مستخدمك)
git remote add origin https://github.com/YOUR_USERNAME/muaafa-health-app.git

# 6. ادفع الكود لـ GitHub
git branch -M main
git push -u origin main
```

---

### 3. إعداد .gitignore (مهم جداً!)

تأكد من أن ملف `.gitignore` موجود ويحتوي على:

```gitignore
# Expo
.expo/
dist/
web-build/

# Dependencies
node_modules/

# Environment variables (CRITICAL!)
.env
.env.local
.env.production

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
build/
```

⚠️ **مهم جداً**: ملف `.env` يجب أن يكون في `.gitignore` لحماية المفاتيح السرية!

---

## 📤 دفع التحديثات بانتظام | Regular Pushes

### سير العمل اليومي:

```bash
# 1. تأكد من أنك في مجلد المشروع
cd /path/to/muaafa-health-app

# 2. تحقق من الملفات المعدلة
git status

# 3. أضف الملفات المعدلة
git add .
# أو أضف ملفات محددة:
# git add app/specific-file.tsx

# 4. اعمل commit مع رسالة واضحة
git commit -m "وصف التغييرات باللغة العربية أو الإنجليزية"

# 5. ادفع للـ GitHub
git push origin main
```

### أمثلة على رسائل الـ Commits:

```bash
git commit -m "✨ Add Zoom integration test tool"
git commit -m "🐛 Fix session retry mechanism"
git commit -m "📝 Update documentation for Zoom setup"
git commit -m "♻️ Refactor sessions page with filters"
git commit -m "🎨 Improve UI for appointments list"
git commit -m "🔒 Add RLS policies for appointments"
```

---

## 🔄 الدفع التلقائي | Automated Pushes

### خيار 1: باستخدام Git Hooks

أنشئ ملف `.git/hooks/post-commit`:

```bash
#!/bin/sh
# Auto push after every commit
git push origin main
```

ثم فعّله:
```bash
chmod +x .git/hooks/post-commit
```

الآن كل مرة تعمل commit، سيتم الـ push تلقائياً!

---

### خيار 2: باستخدام Cron Job (لينكس/ماك)

```bash
# افتح crontab
crontab -e

# أضف هذا السطر (Push كل ساعة)
0 * * * * cd /path/to/muaafa-health-app && git add . && git commit -m "Auto backup" && git push origin main
```

---

### خيار 3: باستخدام Task Scheduler (ويندوز)

أنشئ ملف `auto-push.bat`:

```batch
@echo off
cd C:\path\to\muaafa-health-app
git add .
git commit -m "Automated backup %date% %time%"
git push origin main
```

ثم اجدوله في Windows Task Scheduler.

---

## 👥 مشاركة المشروع مع مطورين | Sharing with Developers

### إضافة collaborators:

1. اذهب لـ GitHub repository
2. **Settings** > **Collaborators**
3. اضغط **"Add people"**
4. أدخل username أو email للمطور
5. اختر الصلاحيات (Write/Admin)

### للمطور الجديد - استنساخ المشروع:

```bash
# 1. Clone المشروع
git clone https://github.com/YOUR_USERNAME/muaafa-health-app.git

# 2. انتقل للمجلد
cd muaafa-health-app

# 3. تثبيت المكتبات
npm install

# 4. إنشاء ملف .env (مهم!)
# انسخ من .env.example أو احصل عليه من صاحب المشروع

# 5. تشغيل المشروع
npm run dev
```

---

## 🔐 حماية المفاتيح السرية | Protecting Secret Keys

### ✅ ما يجب فعله:

1. **أنشئ ملف `.env.example`** بدون قيم حقيقية:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI API
OPENAI_API_KEY=your_openai_key_here

# Zoom API
ZOOM_ACCOUNT_ID=your_zoom_account_id_here
ZOOM_CLIENT_ID=your_zoom_client_id_here
ZOOM_CLIENT_SECRET=your_zoom_client_secret_here
```

2. **ادفع `.env.example` فقط للـ GitHub**:
```bash
git add .env.example
git commit -m "Add environment variables template"
git push
```

3. **شارك `.env` الحقيقي بطريقة آمنة**:
   - عبر أداة مشاركة مشفرة مثل [1Password](https://1password.com/)
   - أو عبر رسالة خاصة مباشرة
   - ❌ **أبداً عبر Git أو GitHub!**

---

## 📊 مراقبة التحديثات | Monitoring Updates

### عرض تاريخ الـ Commits:

```bash
# آخر 10 commits
git log --oneline -10

# تفاصيل commit معين
git show COMMIT_HASH

# الفروقات بين commits
git diff
```

### التراجع عن تغييرات:

```bash
# التراجع عن تغييرات غير محفوظة
git checkout -- filename.tsx

# التراجع عن آخر commit (لكن الملفات تبقى معدلة)
git reset HEAD~1

# التراجع الكامل لـ commit سابق
git reset --hard COMMIT_HASH
```

---

## 🌿 استخدام Branches للتطوير

### إنشاء branch جديد للميزة:

```bash
# إنشاء branch جديد
git checkout -b feature/zoom-improvements

# العمل على الـ branch الجديد
# ... edit files ...
git add .
git commit -m "Improve Zoom integration"

# دفع الـ branch للـ GitHub
git push origin feature/zoom-improvements

# الرجوع للـ main branch
git checkout main

# دمج الـ branch (Merge)
git merge feature/zoom-improvements
git push origin main
```

---

## 🚨 حالات الطوارئ | Emergency Scenarios

### المشكلة: نسيت عمل Push لفترة طويلة

```bash
# تحقق من الملفات المعدلة
git status

# أضف كل شيء
git add .

# Commit شامل
git commit -m "Major update: [وصف التغييرات]"

# Push
git push origin main
```

### المشكلة: تعارض في الـ Code (Merge Conflict)

```bash
# اسحب آخر تحديثات
git pull origin main

# إذا حدث تعارض، ستظهر رسالة
# افتح الملفات المتعارضة وحل التعارض يدوياً
# ثم:
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### المشكلة: دفعت ملف .env بالخطأ

```bash
# احذف من Git (لكن أبقه محلياً)
git rm --cached .env

# Commit
git commit -m "Remove .env from repository"

# Push
git push origin main

# ⚠️ تحذير: الملف لا يزال في تاريخ Git
# للحذف الكامل، راجع: GitHub Support أو أدوات مثل BFG Repo-Cleaner
```

---

## ✅ Checklist يومي | Daily Checklist

قبل إنهاء العمل كل يوم:

- [ ] راجع التغييرات: `git status`
- [ ] أضف الملفات: `git add .`
- [ ] اعمل commit: `git commit -m "..."`
- [ ] ادفع لـ GitHub: `git push origin main`
- [ ] تأكد من نجاح الـ Push (راجع GitHub)

---

## 📚 موارد إضافية | Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Oh My Git! - تعلم Git بطريقة تفاعلية](https://ohmygit.org/)

---

## 🆘 المساعدة | Help

إذا واجهت أي مشكلة:
1. راجع الأخطاء بعناية
2. ابحث في Google عن الرسالة
3. استشر [Stack Overflow](https://stackoverflow.com/)
4. اطلب مساعدة من مطور آخر

---

**نصيحة ذهبية:** 💡
**"Commit early, commit often, push daily!"**
احفظ تقدمك بانتظام، لا تنتظر حتى تنتهي من ميزة كاملة!
