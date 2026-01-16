# 🔐 حساب الإدارة الجديد - MOODi Health

## 📋 بيانات الدخول الجديدة

```
📧 البريد الإلكتروني: admin@moodihealth.sa
🔑 كلمة المرور: MoodiAdmin@2025!Secure
👤 الاسم: مدير النظام
📱 الجوال: 0500000001
```

---

## ⚠️ هام جداً

هذا الحساب **غير موجود بعد**. يجب إنشاؤه أولاً!

---

## 🚀 خطوات إنشاء الحساب

### الطريقة 1: عبر التطبيق (موصى بها)

1. **افتح التطبيق**
2. **اذهب لصفحة التسجيل**
3. **أدخل البيانات التالية:**

```
الاسم الكامل: مدير النظام
البريد الإلكتروني: admin@moodihealth.sa
الجوال: 0500000001
تاريخ الميلاد: 1990-01-01
الجنس: ذكر
المدينة: الرياض
كلمة المرور: MoodiAdmin@2025!Secure
تأكيد كلمة المرور: MoodiAdmin@2025!Secure
```

4. **اضغط "إنشاء حساب"**
5. **بعد التسجيل الناجح، نفذ الأمر SQL التالي:**

```sql
-- الحصول على User ID
SELECT id, email FROM auth.users 
WHERE email = 'admin@moodihealth.sa';

-- ثم استبدل USER_ID بالـ ID الفعلي:
INSERT INTO admin_users (id, role, permissions)
VALUES ('USER_ID_FROM_ABOVE', 'owner', ARRAY['all'])
ON CONFLICT (id) DO UPDATE
SET role = 'owner',
    permissions = ARRAY['all'];
```

---

### الطريقة 2: SQL مباشر (للمطورين)

⚠️ **ملاحظة:** Supabase لا يسمح بإنشاء مستخدمين مباشرة من SQL.
يجب استخدام Supabase Dashboard أو التطبيق.

**في Supabase Dashboard:**
1. اذهب لـ Authentication > Users
2. اضغط "Invite user"
3. أدخل: `admin@moodihealth.sa`
4. ارسل الدعوة
5. سجل دخول وغير كلمة المرور إلى: `MoodiAdmin@2025!Secure`
6. نفذ SQL لإضافة صلاحيات الإدارة

---

## 🔄 بديل: ترقية مستخدم موجود

إذا كنت تريد ترقية أحد المستخدمين الحاليين إلى مسؤول:

### المستخدمون المتاحون:

1. **noor@gmail.com**
   - ID: `4e89a6e2-7f72-4731-9118-6cd16af74f57`

2. **alialqarni329@gmail.com**
   - ID: `fdcdd729-8428-41e7-8d3c-a1185e8d254a`

### ترقية إلى مسؤول:

```sql
-- مثال: ترقية noor@gmail.com
INSERT INTO admin_users (id, role, permissions)
VALUES ('4e89a6e2-7f72-4731-9118-6cd16af74f57', 'owner', ARRAY['all'])
ON CONFLICT (id) DO UPDATE
SET role = 'owner',
    permissions = ARRAY['all'];
```

---

## ✅ التحقق من الصلاحيات

بعد الإضافة، تحقق:

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

---

## 🎯 الوصول للوحة الإدارة

1. سجل دخول بالحساب
2. اذهب للإعدادات ⚙️
3. اضغط "لوحة الإدارة 👑"
4. ستفتح Dashboard كاملة

---

## 🔐 ملاحظات الأمان

```
✅ استخدم كلمة مرور قوية
✅ لا تشارك البيانات
✅ غير كلمة المرور بعد أول دخول
✅ احفظ البيانات في مكان آمن
```

---

**تاريخ الإنشاء:** 18 نوفمبر 2025
**الحالة:** ⏳ في انتظار التنفيذ
