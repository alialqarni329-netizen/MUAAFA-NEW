# خطة ربط البوابات بقاعدة البيانات

## 📊 ملخص الوضع الحالي

### قاعدة البيانات
- **إجمالي الجداول:** 97 جدول
- **الحالة:** جاهز بالكامل

### البوابات
1. **بوابة الأفراد** (Individual Portal): 70% متصلة
2. **بوابة الأعمال** (Business Portal): 40% متصلة
3. **بوابة المالك** (Owner Portal): 20% متصلة

---

## 🎯 خطة العمل

### المرحلة 1: بوابة الأفراد (Individual Portal)

#### الصفحات المتصلة بالفعل ✅
- AI Doctor (chat_conversations, chat_messages)
- Fitness (fitness_activities, health_scans, fitness_ai_recommendations)
- History (chat_conversations, appointments, uploaded_images)
- Sessions (appointments)
- Settings (users)

#### الصفحات التي تحتاج ربط 🔄
1. **Pharmacies Tab** (`app/(tabs)/pharmacies.tsx`)
   - الجداول: `pharmacies`, `pharmacy_categories`, `pharmacy_inventory`, `pharmacy_prices`

2. **Reports Tab** (`app/(tabs)/reports.tsx`)
   - الجداول: `medical_reports`, `medical_documents`, `insurance_requests`, `insurance_approvals`

---

### المرحلة 2: بوابة الأعمال (Business Portal)

#### الصفحات المتصلة ✅
- Dashboard (business_registrations)
- Employees (staff_members, staff_roles)
- Login (Supabase Auth)

#### الصفحات التي تحتاج ربط 🔄

1. **Analytics** (`app/business/analytics.tsx`)
   - الجداول: `user_analytics`, `usage_logs`, `payments`, `appointments`

2. **Claims** (`app/business/claims.tsx`)
   - الجداول: `insurance_requests`, `insurance_approvals`, `insurance_appeals`

3. **Sessions** (`app/business/sessions.tsx`)
   - الجداول: `appointments`, `medical_sessions`, `session_recordings`

4. **Billing** (`app/business/billing.tsx`)
   - الجداول: `payments`, `invoices`, `transactions`

5. **Insurance Dashboard** (`app/business/insurance-dashboard.tsx`)
   - الجداول: `insurance_policies`, `insurance_details`, `covered_facilities`

6. **Delivery Dashboard** (`app/business/delivery-dashboard.tsx`)
   - الجداول: `pharmacy_orders`, `delivery_assignments`, `delivery_proof`

---

### المرحلة 3: بوابة المالك (Owner Portal) - الأولوية القصوى

#### A. إدارة المستخدمين (Users Management)

1. **All Users** (`app/owner/users/index.tsx`) ✅ متصل
   - الجداول: `users`

2. **Individuals** (`app/owner/users/individuals.tsx`) 🔄
   - الجداول: `users WHERE user_role = 'individual'`
   - الأكشن: تعليق/تفعيل/حذف حسابات الأفراد

3. **Owners** (`app/owner/users/owners.tsx`) 🔄
   - الجداول: `users WHERE user_role = 'business_owner'`, `business_registrations`
   - الأكشن: إدارة حسابات أصحاب الأعمال

4. **Employees** (`app/owner/users/employees.tsx`) 🔄
   - الجداول: `business_employees`, `users`
   - الأكشن: إدارة حسابات الموظفين

5. **Suspended Users** (`app/owner/users/suspended.tsx`) 🔄
   - الجداول: `users WHERE banned_until IS NOT NULL`
   - الأكشن: رفع التعليق

6. **Activity Log** (`app/owner/users/activity.tsx`) 🔄
   - الجداول: `activity_logs`, `security_audit_log`

7. **Password Reset** (`app/owner/users/reset.tsx`) 🔄
   - Supabase Admin API
   - الأكشن: إعادة تعيين كلمات المرور

8. **Bulk Actions** (`app/owner/users/actions.tsx`) 🔄
   - الأكشن: إجراءات جماعية على المستخدمين

9. **Health Surveys** (`app/owner/users/health-surveys.tsx`) 🔄
   - الجداول: `medical_questionnaire`, `health_profiles`

#### B. إدارة الأعمال (Business Management)

1. **Overview** (`app/owner/business/index.tsx`) 🔄
   - الجداول: `business_registrations`, `business_accounts`
   - الإحصائيات: إجمالي الشركات حسب النوع

2. **Status** (`app/owner/business/status.tsx`) 🔄
   - الجداول: `business_registrations`
   - الأكشن: تغيير حالة الشركة

3. **Requests** (`app/owner/business/requests.tsx`) ✅ متصل ومصلح
   - الجداول: `business_registrations WHERE status = 'pending'`
   - الأكشن: موافقة/رفض طلبات التسجيل

4. **Hospitals** (`app/owner/business/hospitals.tsx`) 🔄
   - الجداول: `business_registrations WHERE business_type = 'hospital'`
   - الأكشن: إدارة المستشفيات والعيادات

5. **Pharmacies** (`app/owner/business/pharmacies.tsx`) 🔄
   - الجداول: `pharmacies`, `pharmacy_inventory`, `pharmacy_stock`
   - الأكشن: إدارة الصيدليات

6. **Insurance** (`app/owner/business/insurance.tsx`) 🔄
   - الجداول: `business_registrations WHERE business_type = 'insurance'`
   - الأكشن: إدارة شركات التأمين

7. **Activity** (`app/owner/business/activity.tsx`) 🔄
   - الجداول: `activity_logs WHERE entity_type = 'business'`

8. **Permissions** (`app/owner/business/permissions.tsx`) 🔄
   - الجداول: `business_permissions`, `user_permissions`

#### C. إدارة المدفوعات (Payments Management)

1. **All Payments** (`app/owner/payments/index.tsx`) ✅ متصل
   - الجداول: `payments`
   - عمولة المنصة: 10%

2. **Successful** (`app/owner/payments/successful.tsx`) 🔄
   - الجداول: `payments WHERE status IN ('completed', 'paid')`

3. **Failed** (`app/owner/payments/failed.tsx`) 🔄
   - الجداول: `payments WHERE status = 'failed'`

4. **Invoices** (`app/owner/payments/invoices.tsx`) 🔄
   - الجداول: `invoices`, `payments`
   - الأكشن: توليد وإدارة الفواتير

5. **Refunds** (`app/owner/payments/refunds.tsx`) 🔄
   - الجداول: `payments WHERE refunded = true`
   - الأكشن: معالجة المرتجعات

6. **Gateways** (`app/owner/payments/gateways.tsx`) 🔄
   - الجداول: `system_config`, `payment_transactions`

7. **Tax** (`app/owner/payments/tax.tsx`) 🔄
   - الحسابات: ضريبة القيمة المضافة

8. **Logs** (`app/owner/payments/logs.tsx`) 🔄
   - الجداول: `payment_transactions`, `activity_logs`

#### D. إدارة الصيدليات (Pharmacy Management)

1. **Overview** (`app/owner/pharmacy/index.tsx`) 🔄
   - الجداول: `pharmacy_orders`, `pharmacies`
   - الإحصائيات: الطلبات والمبيعات

2. **Orders** (`app/owner/pharmacy/orders.tsx`) 🔄
   - الجداول: `pharmacy_orders`, `order_items`
   - الأكشن: إدارة الطلبات

3. **Medications** (`app/owner/pharmacy/medications.tsx`) 🔄
   - الجداول: `medications`, `medicine_alternatives`
   - الأكشن: إدارة قائمة الأدوية

4. **Completed** (`app/owner/pharmacy/completed.tsx`) 🔄
   - الجداول: `pharmacy_orders WHERE status = 'completed'`

5. **Cancelled** (`app/owner/pharmacy/cancelled.tsx`) 🔄
   - الجداول: `pharmacy_orders WHERE status = 'cancelled'`

6. **History** (`app/owner/pharmacy/history.tsx`) 🔄
   - الجداول: `pharmacy_orders`, `order_timeline`

7. **Availability** (`app/owner/pharmacy/availability.tsx`) 🔄
   - الجداول: `pharmacy_inventory`, `pharmacy_stock`

8. **Pricing** (`app/owner/pharmacy/pricing.tsx`) 🔄
   - الجداول: `pharmacy_prices`
   - الأكشن: تعديل الأسعار

#### E. إدارة الجلسات (Sessions Management)

1. **Overview** (`app/owner/sessions/index.tsx`) 🔄
   - الجداول: `appointments`, `medical_sessions`

2. **Active** (`app/owner/sessions/active.tsx`) 🔄
   - الجداول: `appointments WHERE status IN ('scheduled', 'in_progress')`

3. **Completed** (`app/owner/sessions/completed.tsx`) 🔄
   - الجداول: `appointments WHERE status = 'completed'`

4. **Providers** (`app/owner/sessions/providers.tsx`) 🔄
   - الجداول: `doctors`, `users WHERE user_role = 'doctor'`
   - الأكشن: إدارة الأطباء

5. **Ratings** (`app/owner/sessions/ratings.tsx`) 🔄
   - الجداول: `appointments` (rating field)

6. **Complaints** (`app/owner/sessions/complaints.tsx`) 🔄
   - الجداول: `activity_logs WHERE type = 'complaint'`

7. **Settings** (`app/owner/sessions/settings.tsx`) 🔄
   - الجداول: `system_config`

#### F. التحليلات والتقارير (Analytics)

1. **Overview** (`app/owner/analytics/index.tsx`) 🔄
   - الجداول: `user_analytics`, `usage_logs`

2. **Business Analytics** (`app/owner/analytics/business.tsx`) 🔄
   - الجداول: `business_registrations`, `payments`, `activity_logs`

3. **Revenue** (`app/owner/analytics/revenue.tsx`) 🔄
   - الجداول: `payments`, `settlements`
   - الحسابات: عمولة المنصة 10%

4. **Subscriptions** (`app/owner/analytics/subscriptions.tsx`) 🔄
   - الجداول: `subscriptions`, `user_subscriptions`

5. **Usage** (`app/owner/analytics/usage.tsx`) 🔄
   - الجداول: `usage_logs`, `user_analytics`

#### G. الأمان (Security)

1. **Overview** (`app/owner/security/index.tsx`) 🔄
   - الجداول: `security_audit_log`, `security_config`

2. **Failed Logins** (`app/owner/security/failed-logins.tsx`) 🔄
   - الجداول: `security_audit_log WHERE action = 'failed_login'`

3. **Session Management** (`app/owner/security/session-management.tsx`) 🔄
   - الجداول: `sessions`, Supabase Auth sessions

4. **Modifications** (`app/owner/security/modifications.tsx`) 🔄
   - الجداول: `activity_logs`, `security_audit_log`

5. **IP Restrictions** (`app/owner/security/ip-restrictions.tsx`) 🔄
   - الجداول: `security_config`

#### H. الاشتراكات (Subscriptions)

1. **Active** (`app/owner/subscriptions/active.tsx`) 🔄
   - الجداول: `user_subscriptions WHERE status = 'active'`

2. **Expired** (`app/owner/subscriptions/expired.tsx`) 🔄
   - الجداول: `user_subscriptions WHERE status = 'expired'`

3. **Revenue** (`app/owner/subscriptions/revenue.tsx`) 🔄
   - الجداول: `subscriptions`, `payments`

#### I. الإشعارات (Notifications)

1. **Overview** (`app/owner/notifications/index.tsx`) 🔄
   - الجداول: `app_notifications`, `notification_logs`

2. **Email** (`app/owner/notifications/email.tsx`) 🔄
   - الجداول: `email_logs`, `email_templates`

3. **SMS** (`app/owner/notifications/sms.tsx`) 🔄
   - الجداول: `notification_logs WHERE type = 'sms'`

4. **Business** (`app/owner/notifications/business.tsx`) 🔄
   - الجداول: `app_notifications WHERE recipient_type = 'business'`

5. **Users** (`app/owner/notifications/users.tsx`) 🔄
   - الجداول: `app_notifications WHERE recipient_type = 'user'`

6. **Logs** (`app/owner/notifications/logs.tsx`) 🔄
   - الجداول: `notification_logs`

#### J. إدارة المحتوى (Content Management)

1. **Bot Configuration** (`app/owner/content/bot.tsx`) 🔄
   - الجداول: `system_config`, `health_articles`

2. **Forms** (`app/owner/content/forms.tsx`) 🔄
   - الجداول: `medical_questionnaire`

3. **Questions** (`app/owner/content/questions.tsx`) 🔄
   - الجداول: `medical_questionnaire`

#### K. الإعدادات (Settings)

1. **General** (`app/owner/settings/index.tsx`) 🔄
   - الجداول: `app_settings`, `system_config`

2. **Backup** (`app/owner/settings/backup.tsx`) 🔄
   - Supabase Backup API

3. **Google OAuth** (`app/owner/settings/google.tsx`) 🔄
   - الجداول: `system_config`

---

## 🔗 أكشن المالك التي تؤثر على البوابات الأخرى

### 1. تعليق/تفعيل المستخدمين
- **الأكشن:** المالك يعلق حساب مستخدم
- **التأثير:**
  - المستخدم لا يستطيع الدخول لبوابة الأفراد
  - يظهر في قائمة المستخدمين المعلقين

### 2. الموافقة/رفض الأعمال
- **الأكشن:** المالك يوافق على تسجيل شركة
- **التأثير:**
  - الشركة تستطيع الدخول لبوابة الأعمال
  - تظهر في قائمة الشركات النشطة

### 3. تعديل الأسعار
- **الأكشن:** المالك يعدل أسعار الأدوية
- **التأثير:**
  - الأسعار الجديدة تظهر في بوابة الأفراد
  - الصيدليات ترى التحديثات في بوابة الأعمال

### 4. إدارة الصلاحيات
- **الأكشن:** المالك يعدل صلاحيات موظف
- **التأثير:**
  - الموظف يرى/يخفي أقسام في بوابة الأعمال حسب الصلاحيات

### 5. إلغاء الطلبات
- **الأكشن:** المالك يلغي طلب صيدلية
- **التأثير:**
  - الطلب يظهر كملغي في بوابة الأفراد
  - الصيدلية ترى الإلغاء في بوابة الأعمال

### 6. تعطيل الخدمات
- **الأكشن:** المالك يعطل خدمة معينة
- **التأثير:**
  - الخدمة تختفي من بوابة الأفراد
  - رسالة تظهر للشركات في بوابة الأعمال

---

## 📊 أولويات التنفيذ

### المرحلة 1 (عالية الأولوية)
1. ✅ إدارة المستخدمين الكاملة
2. ✅ إدارة الأعمال مع التحكم الكامل
3. ✅ المدفوعات مع تتبع العمولة

### المرحلة 2 (متوسطة الأولوية)
1. إدارة الصيدليات
2. إدارة الجلسات
3. التحليلات والتقارير

### المرحلة 3 (منخفضة الأولوية)
1. الأمان
2. الاشتراكات
3. الإشعارات
4. إدارة المحتوى

---

## 🎯 المخرجات المتوقعة

بعد إكمال الربط:
- ✅ كل صفحة متصلة بقاعدة البيانات الحقيقية
- ✅ المالك لديه تحكم كامل في جميع البوابات
- ✅ أي تغيير من المالك ينعكس مباشرة على الأفراد والأعمال
- ✅ لا توجد بيانات وهمية أو ثابتة
- ✅ النظام يعمل بشكل متكامل ومتصل

---

**تاريخ الإنشاء:** 30 ديسمبر 2025
**الحالة:** قيد التنفيذ
