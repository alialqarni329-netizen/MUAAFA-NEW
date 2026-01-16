# 🔐 بيانات دخول الإدارة - MOODi Health

## 📋 معلومات الدخول

### حساب المسؤول الرئيسي

```
البريد الإلكتروني: admin@moodi-health.com
كلمة المرور: Moodi@Admin2025!
الصلاحية: owner (مالك)
```

---

## 🚀 كيفية إنشاء الحساب

### الطريقة 1: التسجيل عبر التطبيق

1. افتح التطبيق
2. اذهب لصفحة التسجيل
3. أدخل البيانات التالية:

```
الاسم الكامل: مدير النظام
البريد الإلكتروني: admin@moodi-health.com
الجوال: 0500000000
تاريخ الميلاد: 1990-01-01
الجنس: ذكر
المدينة: الرياض
كلمة المرور: Moodi@Admin2025!
```

4. أكمل التسجيل
5. بعد التسجيل، نفّذ SQL التالي لإضافة صلاحيات الإدارة

### الطريقة 2: إضافة صلاحيات لمستخدم موجود

إذا كان لديك حساب موجود وتريد جعله مسؤولاً:

#### الخطوة 1: احصل على User ID

```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

#### الخطوة 2: أضف صلاحيات الإدارة

```sql
-- استبدل USER_ID_HERE بالـ ID الفعلي
INSERT INTO admin_users (id, role, permissions)
VALUES ('USER_ID_HERE', 'owner', ARRAY['all'])
ON CONFLICT (id) DO UPDATE
SET role = 'owner',
    permissions = ARRAY['all'];
```

---

## 📝 أمثلة على إضافة المسؤولين

### مثال 1: جعل مستخدم موجود مسؤولاً

```sql
-- للمستخدم alialqarni@gmail.com
INSERT INTO admin_users (id, role, permissions)
VALUES ('934adcb3-2beb-4331-893d-0b4026e5347a', 'owner', ARRAY['all'])
ON CONFLICT (id) DO UPDATE
SET role = 'owner',
    permissions = ARRAY['all'];
```

### مثال 2: إضافة مسؤول بصلاحيات محدودة

```sql
-- مسؤول بصلاحية admin (وليس owner)
INSERT INTO admin_users (id, role, permissions)
VALUES ('USER_ID_HERE', 'admin', ARRAY['view_users', 'view_sessions'])
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    permissions = ARRAY['view_users', 'view_sessions'];
```

### مثال 3: إضافة مشرف (moderator)

```sql
-- مشرف بصلاحيات محدودة
INSERT INTO admin_users (id, role, permissions)
VALUES ('USER_ID_HERE', 'moderator', ARRAY['view_sessions'])
ON CONFLICT (id) DO UPDATE
SET role = 'moderator',
    permissions = ARRAY['view_sessions'];
```

---

## 🔑 مستويات الصلاحيات

### 1. Owner (مالك) - أعلى صلاحية
```
✅ الوصول الكامل لكل شيء
✅ إضافة/حذف مسؤولين
✅ إدارة المستخدمين
✅ إدارة الجلسات
✅ الإعدادات المتقدمة
✅ الإحصائيات الكاملة
```

### 2. Admin (مسؤول)
```
✅ إدارة المستخدمين
✅ إدارة الجلسات
✅ الإحصائيات
❌ إضافة/حذف مسؤولين
```

### 3. Moderator (مشرف)
```
✅ عرض المستخدمين
✅ عرض الجلسات
❌ التعديل
❌ الحذف
```

---

## 🧪 التحقق من الصلاحيات

### التحقق من المسؤولين الحاليين

```sql
SELECT
  au.id,
  u.email,
  au.role,
  au.permissions,
  au.created_at
FROM admin_users au
JOIN auth.users u ON u.id = au.id
ORDER BY au.created_at DESC;
```

### التحقق من صلاحية مستخدم معين

```sql
SELECT
  au.role,
  au.permissions
FROM admin_users au
WHERE au.id = 'USER_ID_HERE';
```

---

## 📱 الدخول كمسؤول

### الخطوات:

1. **افتح التطبيق**
2. **اذهب لتسجيل الدخول**
3. **أدخل البيانات:**
   - البريد: `admin@moodi-health.com`
   - كلمة المرور: `Moodi@Admin2025!`
4. **اضغط تسجيل الدخول**
5. **اذهب للإعدادات**
6. **ستظهر لك لوحة الإدارة** 👑

---

## 🔐 الأمان

### ⚠️ تحذيرات مهمة:

1. **لا تشارك** كلمة مرور المسؤول مع أحد
2. **غيّر كلمة المرور** بعد أول تسجيل دخول
3. **لا تحفظ** البيانات في أماكن غير آمنة
4. **استخدم** كلمة مرور قوية ومعقدة
5. **فعّل** المصادقة الثنائية إذا توفرت

### ✅ نصائح الأمان:

```
✅ استخدم كلمات مرور طويلة (12+ حرف)
✅ امزج الأحرف الكبيرة والصغيرة
✅ أضف أرقام ورموز خاصة
✅ غيّر كلمة المرور كل 3 أشهر
✅ لا تستخدم نفس كلمة المرور لحسابات أخرى
```

---

## 🛠️ استكشاف الأخطاء

### المشكلة: لا يظهر زر لوحة الإدارة

**الحل:**
```sql
-- تأكد من إضافة المستخدم لجدول admin_users
INSERT INTO admin_users (id, role, permissions)
VALUES ('YOUR_USER_ID', 'owner', ARRAY['all'])
ON CONFLICT (id) DO UPDATE
SET role = 'owner';
```

ثم سجل خروج ودخول مرة أخرى.

### المشكلة: "Access Denied"

**الحل:**
```sql
-- تحقق من الصلاحيات
SELECT role FROM admin_users WHERE id = 'YOUR_USER_ID';

-- تحديث الصلاحية
UPDATE admin_users
SET role = 'owner'
WHERE id = 'YOUR_USER_ID';
```

### المشكلة: لا أستطيع تسجيل الدخول

**الحل:**
1. تأكد من البريد الإلكتروني صحيح
2. تأكد من كلمة المرور صحيحة (Case-sensitive)
3. تأكد من الحساب مفعّل في Supabase

---

## 📊 SQL للاستخدام السريع

### إنشاء حساب إدارة كامل (نسخ ولصق)

```sql
-- الخطوة 1: احصل على ID المستخدم الذي تريد جعله مسؤولاً
-- (استبدل البريد الإلكتروني بالبريد الفعلي)
DO $$
DECLARE
  user_id_var uuid;
BEGIN
  -- ابحث عن المستخدم
  SELECT id INTO user_id_var
  FROM auth.users
  WHERE email = 'admin@moodi-health.com';

  -- إذا وُجد المستخدم
  IF user_id_var IS NOT NULL THEN
    -- أضف صلاحيات الإدارة
    INSERT INTO admin_users (id, role, permissions)
    VALUES (user_id_var, 'owner', ARRAY['all'])
    ON CONFLICT (id) DO UPDATE
    SET role = 'owner',
        permissions = ARRAY['all'];

    RAISE NOTICE 'تم إضافة صلاحيات الإدارة للمستخدم: %', user_id_var;
  ELSE
    RAISE NOTICE 'المستخدم غير موجود، يرجى التسجيل أولاً';
  END IF;
END $$;
```

---

## 🎯 الخطوات الموصى بها

### للبدء السريع:

1. ✅ سجل حساب جديد في التطبيق
2. ✅ احصل على User ID من Supabase
3. ✅ نفذ SQL لإضافة صلاحيات الإدارة
4. ✅ سجل خروج ودخول
5. ✅ اذهب للإعدادات
6. ✅ اضغط على "لوحة الإدارة" 👑

---

## 📞 معلومات إضافية

**User ID للحسابات الموجودة:**
```
934adcb3-2beb-4331-893d-0b4026e5347a - alialqarni@gmail.com
4e89a6e2-7f72-4731-9118-6cd16af74f57 - noor@gmail.com
fdcdd729-8428-41e7-8d3c-a1185e8d254a - alialqarni329@gmail.com
```

**لجعل أي من هذه الحسابات مسؤولاً، نفذ:**
```sql
-- مثال لجعل alialqarni@gmail.com مسؤولاً
INSERT INTO admin_users (id, role, permissions)
VALUES ('934adcb3-2beb-4331-893d-0b4026e5347a', 'owner', ARRAY['all'])
ON CONFLICT (id) DO UPDATE
SET role = 'owner',
    permissions = ARRAY['all'];
```

---

**تاريخ الإنشاء:** نوفمبر 2025
**الإصدار:** 1.0
**الحالة:** ✅ جاهز للاستخدام
