# 🗄️ دليل تصدير ونقل قاعدة البيانات
# Database Export & Migration Guide

## 🎯 الهدف | Goal

هذا الدليل يساعدك على:
- ✅ تصدير قاعدة البيانات الكاملة من Supabase
- ✅ نقل البيانات لـ Supabase instance جديد
- ✅ عمل نسخ احتياطية منتظمة
- ✅ تسهيل نقل المشروع لمطور آخر أو بيئة أخرى

---

## 📊 معلومات قاعدة البيانات الحالية

**Supabase URL**: `https://tmkkmzrmtjctchfxseoh.supabase.co`
**Project ID**: `tmkkmzrmtjctchfxseoh`

⚠️ **مهم**: يجب أن تكون مالك المشروع أو لديك صلاحيات Owner/Admin

---

## 🔐 التحقق من ملكية المشروع | Verify Ownership

### 1. تسجيل الدخول لـ Supabase

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. سجل دخول بإيميلك الشخصي
3. يجب أن ترى المشروع `tmkkmzrmtjctchfxseoh`
4. اضغط على المشروع للتأكد من وصولك

### 2. التحقق من الصلاحيات

- اذهب لـ **Settings** > **General**
- تحقق من قسم **Organization**
- تأكد أنك **Owner** أو **Admin**

---

## 📤 تصدير Schema (البنية)

### الطريقة 1: عبر Supabase Dashboard (الأسهل)

1. اذهب لـ [Supabase Dashboard](https://supabase.com/dashboard)
2. افتح مشروعك
3. اذهب لـ **Database** > **Migrations**
4. اضغط **"Export schema"**
5. سيتم تنزيل ملف SQL يحتوي على كامل البنية

### الطريقة 2: عبر pg_dump (متقدم)

```bash
# احصل على Connection String من Supabase Dashboard:
# Settings > Database > Connection string (URI)

pg_dump \
  --schema-only \
  --no-owner \
  --no-privileges \
  "postgresql://postgres:[YOUR_PASSWORD]@db.tmkkmzrmtjctchfxseoh.supabase.co:5432/postgres" \
  > supabase_schema.sql
```

### محتويات الـ Schema:

- ✅ جميع الجداول (Tables)
- ✅ العلاقات (Foreign Keys)
- ✅ الفهارس (Indexes)
- ✅ سياسات الأمان (RLS Policies)
- ✅ الدوال (Functions)
- ✅ المحفزات (Triggers)

---

## 📥 تصدير البيانات (Data)

### الطريقة 1: عبر Supabase Dashboard

#### لجدول واحد:
1. **Database** > **Table Editor**
2. اختر الجدول
3. اضغط **"Export data"**
4. اختر الصيغة (CSV, JSON)

#### لجميع الجداول:
استخدم الطريقة 2 أدناه

### الطريقة 2: عبر pg_dump

```bash
# تصدير البيانات فقط
pg_dump \
  --data-only \
  --no-owner \
  --no-privileges \
  "postgresql://postgres:[YOUR_PASSWORD]@db.tmkkmzrmtjctchfxseoh.supabase.co:5432/postgres" \
  > supabase_data.sql
```

### الطريقة 3: تصدير Schema + Data معاً

```bash
# تصدير شامل
pg_dump \
  --no-owner \
  --no-privileges \
  "postgresql://postgres:[YOUR_PASSWORD]@db.tmkkmzrmtjctchfxseoh.supabase.co:5432/postgres" \
  > supabase_full_backup.sql
```

---

## 💾 النسخ الاحتياطي التلقائي | Automated Backups

### خيار 1: باستخدام Cron Job (Linux/Mac)

أنشئ script `backup_supabase.sh`:

```bash
#!/bin/bash

# معلومات الاتصال
DB_CONNECTION="postgresql://postgres:[YOUR_PASSWORD]@db.tmkkmzrmtjctchfxseoh.supabase.co:5432/postgres"
BACKUP_DIR="$HOME/supabase_backups"
DATE=$(date +%Y%m%d_%H%M%S)

# أنشئ مجلد النسخ الاحتياطية إذا لم يكن موجوداً
mkdir -p "$BACKUP_DIR"

# تصدير قاعدة البيانات
pg_dump --no-owner --no-privileges "$DB_CONNECTION" > "$BACKUP_DIR/backup_$DATE.sql"

# احذف النسخ الأقدم من 30 يوم
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql"
```

فعّل الصلاحيات:
```bash
chmod +x backup_supabase.sh
```

أضفه لـ Crontab (نسخة احتياطية يومية الساعة 2 صباحاً):
```bash
crontab -e

# أضف هذا السطر:
0 2 * * * /path/to/backup_supabase.sh
```

### خيار 2: باستخدام Task Scheduler (Windows)

أنشئ ملف `backup_supabase.bat`:

```batch
@echo off
SET CONNECTION=postgresql://postgres:[YOUR_PASSWORD]@db.tmkkmzrmtjctchfxseoh.supabase.co:5432/postgres
SET BACKUP_DIR=C:\supabase_backups
SET DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

pg_dump --no-owner --no-privileges "%CONNECTION%" > "%BACKUP_DIR%\backup_%DATE%.sql"

echo Backup completed: backup_%DATE%.sql
```

ثم اجدوله في Windows Task Scheduler.

---

## 🔄 استيراد لـ Supabase جديد | Import to New Supabase

### 1. إنشاء Supabase Project جديد

1. اذهب لـ [Supabase](https://supabase.com/dashboard)
2. اضغط **"New project"**
3. اختر اسم المشروع والمنطقة
4. احفظ **Database password** في مكان آمن
5. انتظر حتى ينتهي الإعداد (~2 دقيقة)

### 2. استيراد الـ Schema

#### عبر Dashboard:
1. **Database** > **Migrations**
2. اضغط **"Create a new migration"**
3. الصق محتوى ملف `supabase_schema.sql`
4. اضغط **"Run migration"**

#### عبر psql:
```bash
psql "postgresql://postgres:[NEW_PASSWORD]@db.[NEW_PROJECT_ID].supabase.co:5432/postgres" \
  < supabase_schema.sql
```

### 3. استيراد البيانات

```bash
psql "postgresql://postgres:[NEW_PASSWORD]@db.[NEW_PROJECT_ID].supabase.co:5432/postgres" \
  < supabase_data.sql
```

### 4. التحقق من الاستيراد

```sql
-- عدد الجداول
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public';

-- عدد الصفوف في كل جدول
SELECT
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

---

## 📋 قائمة الجداول في المشروع الحالي

### Core Tables:
- `users` - بيانات المستخدمين
- `doctors` - بيانات الأطباء
- `appointments` - المواعيد والجلسات
- `medical_questionnaires` - الاستبيانات الطبية

### Subscription System:
- `subscription_plans` - خطط الاشتراك
- `user_subscriptions` - اشتراكات المستخدمين
- `subscription_payments` - سجل المدفوعات
- `subscription_features` - ميزات الخطط

### Pharmacy System:
- `pharmacy_categories` - تصنيفات الصيدليات
- `treatment_plans` - خطط العلاج
- `cart_items` - عربة التسوق
- `orders` - الطلبات
- `order_items` - تفاصيل الطلبات

### Fitness System:
- `fitness_goals` - أهداف اللياقة
- `workout_logs` - سجل التمارين
- `health_metrics` - المقاييس الصحية

### Insurance & Reports:
- `insurance_providers` - شركات التأمين
- `user_insurance` - تأمينات المستخدمين
- `medical_reports` - التقارير الطبية
- `report_approval_requests` - طلبات الموافقة

### Business Accounts:
- `business_registrations` - تسجيلات الأعمال
- `pharmacy_accounts` - حسابات الصيدليات
- `delivery_accounts` - حسابات التوصيل
- `insurance_accounts` - حسابات التأمين

### Other:
- `admin_users` - مستخدمو الإدارة
- `session_recordings` - تسجيلات الجلسات
- `notifications` - الإشعارات
- `ai_chat_conversations` - محادثات AI
- `ai_chat_messages` - رسائل AI

---

## 🔄 نقل ملكية المشروع | Transfer Project Ownership

### إذا أردت نقل المشروع لشخص آخر:

#### 1. نقل عبر Supabase (الأسهل)
1. اذهب لـ **Settings** > **General**
2. في قسم **Transfer project**
3. أدخل إيميل المالك الجديد
4. اضغط **"Transfer project"**

#### 2. إعطاء صلاحيات كاملة
1. **Settings** > **Team Settings**
2. اضغط **"Invite team member"**
3. أدخل الإيميل
4. اختر Role: **Owner**
5. اضغط **"Send invite"**

---

## 📦 حزمة النقل الكاملة | Complete Transfer Package

عند نقل المشروع لمطور آخر، أرسل له:

### 1. الكود (عبر GitHub)
```
https://github.com/YOUR_USERNAME/muaafa-health-app
```

### 2. ملفات قاعدة البيانات
- ✅ `supabase_schema.sql` - بنية قاعدة البيانات
- ✅ `supabase_data.sql` - البيانات (اختياري)
- ✅ جميع ملفات الـ Migrations في `supabase/migrations/`

### 3. ملف `.env` (بطريقة آمنة!)
أرسله عبر:
- 1Password Secure Share
- LastPass
- Bitwarden Send
- أو رسالة مشفرة

### 4. التوثيق
- ✅ `README.md`
- ✅ `DATABASE_EXPORT_GUIDE.md` (هذا الملف)
- ✅ `GIT_SETUP_GUIDE.md`
- ✅ `ZOOM_SETUP_GUIDE.md`
- ✅ جميع ملفات الـ `*.md` الأخرى

### 5. معلومات الحسابات
- إيميل Supabase وكلمة المرور
- معلومات Zoom API
- معلومات OpenAI API
- أي APIs أخرى

---

## 🔒 الأمان | Security

### ⚠️ مهم جداً:

1. **لا ترسل ملف `.env` عبر Git أبداً**
2. **غيّر جميع كلمات المرور بعد النقل**
3. **أعد إنشاء API Keys جديدة للمشروع الجديد**
4. **احذف الصلاحيات القديمة بعد النقل**
5. **راجع RLS Policies للتأكد من الأمان**

---

## 🧪 اختبار النسخة الاحتياطية | Test Backup

### خطوات الاختبار:

1. **صدّر قاعدة البيانات**
```bash
pg_dump [...] > test_backup.sql
```

2. **أنشئ project Supabase تجريبي**

3. **استورد النسخة الاحتياطية**
```bash
psql [...] < test_backup.sql
```

4. **تحقق من البيانات**
   - عدد الجداول صحيح؟
   - عدد الصفوف صحيح؟
   - RLS Policies موجودة؟
   - Functions تعمل؟

5. **اختبر التطبيق**
   - سجل دخول
   - احجز موعد
   - اختبر الميزات الرئيسية

---

## 📚 أدوات مساعدة | Helper Tools

### 1. Supabase CLI
```bash
# تثبيت
npm install -g supabase

# تسجيل دخول
supabase login

# ربط المشروع
supabase link --project-ref tmkkmzrmtjctchfxseoh

# تصدير الـ schema
supabase db dump -f supabase_schema.sql
```

### 2. pgAdmin
- أداة GUI لإدارة PostgreSQL
- [تحميل pgAdmin](https://www.pgadmin.org/download/)

### 3. DBeaver
- أداة مجانية لإدارة قواعد البيانات
- [تحميل DBeaver](https://dbeaver.io/download/)

---

## ✅ Checklist للنسخ الاحتياطي الشهري

- [ ] تصدير Schema: `supabase_schema_YYYYMMDD.sql`
- [ ] تصدير Data: `supabase_data_YYYYMMDD.sql`
- [ ] حفظ في مكان آمن (Google Drive, Dropbox, etc.)
- [ ] تحديث ملف `.env.example` إذا تغيرت المتغيرات
- [ ] دفع آخر تحديثات الكود لـ GitHub
- [ ] توثيق أي تغييرات كبيرة

---

## 🆘 المساعدة | Help

### مشاكل شائعة:

#### المشكلة: pg_dump command not found
**الحل**: ثبّت PostgreSQL Client
- Linux: `sudo apt-get install postgresql-client`
- Mac: `brew install postgresql`
- Windows: [Download PostgreSQL](https://www.postgresql.org/download/windows/)

#### المشكلة: Connection refused
**الحل**:
1. تحقق من Connection String
2. تأكد من IP Pooling settings في Supabase
3. جرب استخدام Direct connection بدلاً من Pooler

#### المشكلة: Permission denied
**الحل**:
1. تأكد من استخدام Database Password الصحيح
2. تحقق من صلاحياتك في المشروع

---

**نصيحة ذهبية:** 💡
**"3-2-1 Backup Rule"**
- 3 نسخ من بياناتك
- 2 أنواع مختلفة من وسائط التخزين
- 1 نسخة خارج الموقع (Cloud)
