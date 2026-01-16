# 🔐 حسابات الإدارة الجديدة - MOODi Health

## 📅 تاريخ الإنشاء: 18 نوفمبر 2025

---

## 👑 حسابات الإدارة الجاهزة

### الحساب 1: المدير العام
```
📧 البريد الإلكتروني: ceo@moodihealth.sa
🔑 كلمة المرور: MoodiCEO@2025#Secure
👤 الاسم: المدير التنفيذي
👑 الصلاحية: owner
📊 الصلاحيات: جميع الصلاحيات (all)
```

### الحساب 2: مدير النظام
```
📧 البريد الإلكتروني: sysadmin@moodihealth.sa
🔑 كلمة المرور: SysAdmin@2025#Strong
👤 الاسم: مدير النظام
👑 الصلاحية: owner
📊 الصلاحيات: جميع الصلاحيات (all)
```

### الحساب 3: المشرف الطبي
```
📧 البريد الإلكتروني: medical@moodihealth.sa
🔑 كلمة المرور: Medical@2025#Admin
👤 الاسم: المشرف الطبي
👑 الصلاحية: admin
📊 الصلاحيات: عرض وإدارة
```

---

## 🚀 خطوات تفعيل الحسابات

### الطريقة الموصى بها:

#### الخطوة 1: التسجيل عبر التطبيق

**للحساب 1 (CEO):**
```
1. افتح التطبيق
2. اذهب لصفحة التسجيل
3. أدخل البيانات:
   - الاسم: المدير التنفيذي
   - البريد: ceo@moodihealth.sa
   - الجوال: 0550000001
   - تاريخ الميلاد: 1985-01-01
   - الجنس: ذكر
   - المدينة: الرياض
   - كلمة المرور: MoodiCEO@2025#Secure
4. سجل الحساب
5. نفذ SQL لإضافة صلاحيات الإدارة
```

**للحساب 2 (SysAdmin):**
```
نفس الخطوات مع:
   - الاسم: مدير النظام
   - البريد: sysadmin@moodihealth.sa
   - الجوال: 0550000002
   - كلمة المرور: SysAdmin@2025#Strong
```

**للحساب 3 (Medical):**
```
نفس الخطوات مع:
   - الاسم: المشرف الطبي
   - البريد: medical@moodihealth.sa
   - الجوال: 0550000003
   - كلمة المرور: Medical@2025#Admin
```

---

#### الخطوة 2: إضافة صلاحيات الإدارة

بعد تسجيل كل حساب، نفذ SQL التالي:

**للحساب 1 & 2 (Owner):**
```sql
-- الحصول على User ID أولاً
SELECT id, email FROM auth.users 
WHERE email IN ('ceo@moodihealth.sa', 'sysadmin@moodihealth.sa');

-- إضافة صلاحية owner
INSERT INTO admin_users (id, role, permissions)
VALUES 
  ('USER_ID_1', 'owner', ARRAY['all']),
  ('USER_ID_2', 'owner', ARRAY['all'])
ON CONFLICT (id) DO UPDATE
SET role = 'owner',
    permissions = ARRAY['all'];
```

**للحساب 3 (Admin):**
```sql
-- الحصول على User ID
SELECT id, email FROM auth.users 
WHERE email = 'medical@moodihealth.sa';

-- إضافة صلاحية admin
INSERT INTO admin_users (id, role, permissions)
VALUES ('USER_ID_3', 'admin', ARRAY['view_users', 'view_sessions', 'manage_sessions'])
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    permissions = ARRAY['view_users', 'view_sessions', 'manage_sessions'];
```

---

## 📋 الطريقة السريعة (Supabase Dashboard)

### عبر Supabase Dashboard:

1. **اذهب إلى:** `Authentication > Users`
2. **اضغط:** `Add user`
3. **أدخل البيانات:**
   - Email: `ceo@moodihealth.sa`
   - Password: `MoodiCEO@2025#Secure`
   - Auto Confirm User: ✅
4. **احفظ**
5. **كرر** للحسابات الأخرى
6. **نفذ SQL** لإضافة صلاحيات الإدارة

---

## 🔐 مستويات الصلاحيات

### Owner (مالك):
```
✅ وصول كامل للوحة الإدارة
✅ عرض جميع المستخدمين
✅ عرض وإدارة جميع الجلسات
✅ الإحصائيات الكاملة
✅ إضافة/حذف مسؤولين
✅ جميع الإعدادات
✅ تصدير البيانات
```

### Admin (مسؤول):
```
✅ عرض المستخدمين
✅ عرض الجلسات
✅ إدارة الجلسات
✅ الإحصائيات الأساسية
❌ إضافة/حذف مسؤولين
❌ الإعدادات المتقدمة
```

### Moderator (مشرف):
```
✅ عرض المستخدمين
✅ عرض الجلسات
❌ التعديل
❌ الحذف
```

---

## 🎯 الوصول للوحة الإدارة

### بعد تفعيل الحساب:

```
1. افتح التطبيق
2. سجل دخول بأحد الحسابات الجديدة
3. اذهب للإعدادات ⚙️
4. اضغط "لوحة الإدارة 👑"
5. ستفتح Dashboard كاملة
```

---

## ✅ التحقق من الصلاحيات

### SQL للتحقق:
```sql
-- عرض جميع المسؤولين
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

### التحقق من حساب معين:
```sql
SELECT 
  u.email,
  au.role,
  au.permissions
FROM auth.users u
LEFT JOIN admin_users au ON au.id = u.id
WHERE u.email IN (
  'ceo@moodihealth.sa',
  'sysadmin@moodihealth.sa', 
  'medical@moodihealth.sa'
);
```

---

## 🔒 أمان الحسابات

### كلمات المرور:
```
✅ طول 20+ حرف
✅ أحرف كبيرة وصغيرة
✅ أرقام
✅ رموز خاصة (#@!)
✅ لا تحتوي على كلمات شائعة
```

### التوصيات:
```
⚠️ غير كلمة المرور بعد أول دخول
⚠️ لا تشارك البيانات مع أحد
⚠️ استخدم حسابات منفصلة لكل مسؤول
⚠️ راجع السجلات بانتظام
⚠️ فعّل Two-Factor Authentication إذا توفرت
```

---

## 📊 ملخص الحسابات

| الحساب | البريد | الصلاحية | الحالة |
|--------|--------|----------|--------|
| CEO | ceo@moodihealth.sa | owner | ⏳ للإنشاء |
| SysAdmin | sysadmin@moodihealth.sa | owner | ⏳ للإنشاء |
| Medical | medical@moodihealth.sa | admin | ⏳ للإنشاء |

---

## 🔧 استكشاف الأخطاء

### لا يظهر زر لوحة الإدارة؟
```sql
-- تحقق من الصلاحيات
SELECT * FROM admin_users WHERE id = 'YOUR_USER_ID';

-- إضافة الصلاحية
INSERT INTO admin_users (id, role, permissions)
VALUES ('YOUR_USER_ID', 'owner', ARRAY['all'])
ON CONFLICT (id) DO UPDATE SET role = 'owner';
```

### "Access Denied"؟
```
1. تأكد من تسجيل الدخول بالحساب الصحيح
2. تحقق من وجود صلاحيات في admin_users
3. سجل خروج ودخول مرة أخرى
4. امسح cache التطبيق
```

---

## 📝 ملاحظات مهمة

```
⚡ هذه حسابات جديدة كلياً
🆕 بريد إلكتروني: @moodihealth.sa
🔐 كلمات مرور قوية جداً
👥 ثلاثة حسابات لثلاثة مستويات
✅ جاهزة للاستخدام الفوري
```

---

## 🎉 الخلاصة

**لديك الآن 3 حسابات إدارة احترافية:**
1. ✅ CEO - مدير تنفيذي
2. ✅ SysAdmin - مدير نظام
3. ✅ Medical - مشرف طبي

**كل حساب له:**
- ✅ بريد احترافي
- ✅ كلمة مرور قوية
- ✅ صلاحيات محددة
- ✅ وصول للوحة الإدارة

---

**تاريخ الإنشاء:** 18 نوفمبر 2025
**الحالة:** ⏳ **جاهزة للتفعيل**
**الأمان:** 🔒 **مشدد**
