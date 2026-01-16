# 🚀 كيفية نشر التطبيق على الدومين

## ⚡ الطريقة الأسرع - Vercel CLI

### 1. تثبيت Vercel CLI (إذا لم يكن مثبت)
```bash
npm i -g vercel
```

### 2. تسجيل الدخول
```bash
vercel login
```

### 3. النشر مباشرة
```bash
vercel --prod
```

**ستظهر أسئلة:**
- Set up and deploy? → **Yes**
- Which scope? → اختر حسابك
- Link to existing project? → **Yes** (إذا كان المشروع موجود)
- What's the name? → اختر اسم المشروع الحالي

**سيتم النشر تلقائياً!**

---

## 🔄 الطريقة البديلة - Git Push

### إذا كان المشروع متصل بـ Git Repository:

```bash
# 1. أضف التغييرات
git add .

# 2. أنشئ commit
git commit -m "Update: Deploy latest version"

# 3. ارفع إلى الريبو
git push origin main
```

**Vercel سينشر تلقائياً عند الـ push!**

---

## 🌐 الطريقة اليدوية - Vercel Dashboard

### 1. افتح Vercel Dashboard
https://vercel.com/dashboard

### 2. اختر المشروع
ابحث عن مشروع **muaafa-health**

### 3. انشر من جديد
- اضغط على "Deployments"
- اضغط على "Redeploy" على آخر deployment
- اختر **"Rebuild"** (مهم جداً!)
- اضغط "Redeploy"

---

## ⚙️ متغيرات البيئة (مهم!)

قبل النشر، **تأكد** من وجود المتغيرات في Vercel:

1. اذهب إلى: **Project Settings → Environment Variables**

2. تحقق من:
   ```
   ✅ EXPO_PUBLIC_SUPABASE_URL
   ✅ EXPO_PUBLIC_SUPABASE_ANON_KEY
   ```

3. إذا لم تكن موجودة:
   - اضغط "Add New"
   - انسخ القيم من ملف `.env` المحلي
   - اختر: **Production, Preview, Development**
   - احفظ

---

## 🔍 بعد النشر - تحقق من النسخة الجديدة

### 1. امسح الـ Cache (مهم جداً!)

**في المتصفح:**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**أو افتح وضع Incognito:**
```
Chrome: Ctrl + Shift + N
Firefox: Ctrl + Shift + P
```

### 2. افتح الدومين
```
https://your-domain.vercel.app
```

### 3. تحقق من النسخة
افتح Console (F12) واكتب:
```javascript
document.title
// يجب أن يظهر: "مُعافى | MUAAFA"

new Date(document.lastModified)
// يجب أن يكون تاريخ اليوم
```

### 4. اختبر التسجيل
- جرب تسجيل منشأة جديدة
- يجب أن تعمل بدون أخطاء
- رسائل واضحة بالعربية

---

## 🐛 حل المشاكل الشائعة

### المشكلة: لا تزال النسخة القديمة تظهر

**الحلول:**

#### 1. Hard Refresh
```
Ctrl + Shift + R (عدة مرات)
```

#### 2. امسح Cache المتصفح
```
Chrome: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
اختر: Cached images and files
```

#### 3. امسح Vercel Build Cache
في Vercel Dashboard:
- Project Settings → General
- اضغط "Clear Build Cache"
- أعد deploy

#### 4. أضف Timestamp للـ URL
```
https://your-domain.com?v=20241225
```

### المشكلة: خطأ في البناء

```bash
# امسح node_modules وأعد التثبيت
rm -rf node_modules package-lock.json
npm install

# أعد البناء
npm run build:web

# تحقق من الأخطاء
```

### المشكلة: Vercel لا يكتشف التغييرات

**في Vercel Dashboard:**
1. Project Settings → Git
2. تحقق من "Production Branch" هو **main** أو **master**
3. تحقق من "Ignored Build Step" معطل

---

## ✅ علامات النجاح

بعد النشر الناجح، يجب أن ترى:

1. ✅ **صفحة تسجيل الدخول تظهر بشكل صحيح**
2. ✅ **عنوان الصفحة: "مُعافى | MUAAFA"**
3. ✅ **تسجيل المنشآت يعمل بدون أخطاء RLS**
4. ✅ **رسائل الخطأ واضحة بالعربية**
5. ✅ **لا أخطاء في Console (F12)**
6. ✅ **التطبيق responsive على الجوال**

---

## 📊 تحديثات هذه النسخة

### ما تم إصلاحه:
1. ✅ **إصلاح RLS policies** - تسجيل المنشآت يعمل
2. ✅ **رسائل خطأ محسّنة** - بالعربية وواضحة
3. ✅ **فحص البريد محسّن** - دعم علامة +
4. ✅ **Cache Control** - النسخة القديمة لن تظهر
5. ✅ **Security Headers** - حماية محسّنة

### التحسينات:
- Cache للملفات الثابتة (سنة كاملة)
- No-cache للـ HTML الرئيسي (ضمان النسخة الجديدة)
- Clean URLs
- Security headers محسّنة

---

## 🎯 الخطوة التالية

**اختر طريقة واحدة وانشر:**

### الأسرع:
```bash
vercel --prod
```

### الأسهل:
```bash
git add . && git commit -m "Deploy" && git push
```

---

## 📞 إذا احتجت مساعدة

أرسل:
1. Screenshot من الخطأ
2. Console logs (F12)
3. URL الدومين
4. الطريقة المستخدمة للنشر

---

**تاريخ البناء:** 25 ديسمبر 2024، 7:08 مساءً
**حجم البناء:** 4.0 MB
**الحالة:** ✅ جاهز للنشر
**النسخة:** الأحدث مع جميع الإصلاحات
