# المحفظة الصحية الشاملة - نظام التأمين والموافقات الطبية

## 🎯 نظرة عامة

تم تطوير **"المحفظة الصحية"** - نظام متكامل لإدارة التأمين الصحي، الموافقات الطبية، والتقارير الطبية بشكل احترافي وذكي. هذا النظام يحول تجربة إدارة التأمين الصحي إلى تجربة رقمية سلسة مثل Apple Wallet.

---

## ✨ المميزات الرئيسية

### 1. 💳 بطاقة التأمين الرقمية (Digital Insurance Card)

**تصميم يحاكي Apple Wallet** - بطاقة رقمية جميلة وعملية تعرض:

- ✅ اسم شركة التأمين
- ✅ رقم البوليصة
- ✅ فئة التأمين (A, B, C)
- ✅ تاريخ الانتهاء مع تنبيه تلقائي
- ✅ أيقونة Shield أنيقة
- ✅ تدرج لوني جذاب (Gradient)
- ✅ زر "شبكة الفروع" للوصول السريع

**الخصائص الأمنية:**
- تشفير صور البطاقة (الأمامية والخلفية)
- حفظ آمن في Supabase Storage
- حماية بـ RLS (Row Level Security)

---

### 2. 📋 نظام تتبع الموافقات الطبية (Approval Tracker)

**خط تتبع تفاعلي** (Status Timeline) - مثل تتبع الطرود البريدية!

#### مراحل الموافقة:
```
1. تم الرفع ✓
   ↓
2. قيد المراجعة لدى شركة التأمين ⏳
   ↓
3. تم إصدار الموافقة ✓ / مرفوض ✗
```

#### أنواع الطلبات:
- **جلسات طبية** (Appointments)
- **أدوية** (Medications)
- **إجراءات طبية** (Procedures)
- **فحوصات** (Lab Tests)

#### حالات الموافقة:
- **submitted** - تم الرفع (رمادي)
- **under_review** - قيد المراجعة (برتقالي)
- **approved** - تمت الموافقة (أخضر)
- **rejected** - مرفوض (أحمر)
- **appealed** - قيد الاعتراض (بنفسجي)

**الإشعارات اللحظية:**
- إشعار فوري عند تغيير الحالة
- تحديث تلقائي من قاعدة البيانات
- إشعارات Push (قابلة للتطوير مستقبلاً)

---

### 3. ⚖️ نظام الاعتراضات والطعون (Appeals System)

**في حالة رفض الطلب:**

1. **زر "تقديم اعتراض"** يظهر تلقائياً
2. **رفع مستندات إضافية** من المستخدم
3. **رسالة توضيحية من الطبيب** مباشرة عبر التطبيق
4. **تتبع حالة الاعتراض** بنفس الخط الزمني
5. **قسم "الاعتراضات النشطة"** لمتابعة الردود

**سير العمل:**
```
الرفض → تقديم اعتراض → مراجعة شركة التأمين → قبول/رفض الاعتراض
```

---

### 4. 📁 أرشفة التقارير والمستندات (Medical Archiving)

**نظام مجلدات ذكي** - مثل Google Drive الطبي!

#### المجلدات الرئيسية:
- 📄 **تقارير طبية** (Medical Reports)
- 🔬 **الأشعة** (X-Rays)
- 💰 **الفواتير** (Bills)
- ✅ **الموافقات السابقة** (Approvals)
- 💊 **الروشتات** (Prescriptions)

#### ميزة الذكاء الاصطناعي - **"تبسيط التقرير"**:

**زر [تبسيط التقرير]** - AI-Powered:
- قراءة نتائج التحاليل الطبية
- شرحها بلغة بسيطة ومفهومة
- توضيح إذا كانت النتائج طبيعية أم تحتاج متابعة
- شرح المصطلحات الطبية الصعبة
- تحديد ما إذا كانت مشمولة في التأمين

**Edge Function: `simplify-medical-report`**
- استخدام OpenAI GPT-4
- دعم اللغتين العربية والإنجليزية
- حفظ الملخص في قاعدة البيانات
- عرض الملخص بأيقونة ✨ Sparkles

---

### 5. 🏥 شبكة الفروع المتعاقدة (Covered Facilities)

**واجهة خاصة للمستشفيات والعيادات:**

#### قاعدة بيانات `covered_facilities`:
- اسم المنشأة والموقع
- نوع المنشأة (مستشفى/عيادة/صيدلية/معمل)
- الفئات المغطاة (A, B, C)
- الخدمات المتاحة
- معلومات الاتصال
- الإحداثيات (للخريطة)

**زر "شبكة الفروع"** من البطاقة الرقمية:
- عرض المنشآت المغطاة بناءً على فئة التأمين
- فلترة حسب المدينة والخدمة
- ربط مع خريطة Google Maps
- رابط لصفحة تفصيلية `/reports/health-approvals`

---

## 🗄️ قاعدة البيانات (Database Schema)

### 1. `insurance_details` - تفاصيل التأمين

```sql
CREATE TABLE insurance_details (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  insurance_company text NOT NULL,
  policy_number text NOT NULL,
  insurance_category text DEFAULT 'C',
  start_date date NOT NULL,
  end_date date NOT NULL,
  card_front_image text,
  card_back_image text,
  coverage_details jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz,
  updated_at timestamptz
);
```

**الحماية:**
- RLS: المستخدم يرى تأمينه فقط
- تشفير الصور
- تحديث تلقائي لـ `updated_at`

---

### 2. `insurance_requests` - طلبات الموافقات

```sql
CREATE TABLE insurance_requests (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  insurance_id uuid REFERENCES insurance_details,
  request_type text NOT NULL,
  related_id uuid,
  status text DEFAULT 'submitted',
  request_date timestamptz,
  review_date timestamptz,
  approval_date timestamptz,
  rejection_reason text,
  approval_number text,
  coverage_amount numeric(10,2),
  documents jsonb,
  hospital_id uuid,
  created_at timestamptz,
  updated_at timestamptz
);
```

**حقول مهمة:**
- `request_type`: نوع الطلب (appointment, medication, procedure)
- `related_id`: ربط مع الجلسة أو الدواء
- `status`: الحالة (submitted, under_review, approved, rejected, appealed)
- `approval_number`: رقم الموافقة عند القبول
- `documents`: المستندات المرفقة (JSON Array)

---

### 3. `insurance_appeals` - الاعتراضات

```sql
CREATE TABLE insurance_appeals (
  id uuid PRIMARY KEY,
  request_id uuid REFERENCES insurance_requests,
  user_id uuid REFERENCES auth.users,
  appeal_reason text NOT NULL,
  additional_documents jsonb,
  doctor_letter text,
  status text DEFAULT 'submitted',
  appeal_date timestamptz,
  response_date timestamptz,
  response_message text,
  created_at timestamptz,
  updated_at timestamptz
);
```

**الميزات:**
- ربط بالطلب الأصلي
- رفع مستندات إضافية
- رسالة من الطبيب
- رد شركة التأمين

---

### 4. `covered_facilities` - المنشآت المغطاة

```sql
CREATE TABLE covered_facilities (
  id uuid PRIMARY KEY,
  insurance_company text NOT NULL,
  facility_name text NOT NULL,
  facility_type text NOT NULL,
  category_coverage text[],
  address text,
  city text,
  phone text,
  coordinates jsonb,
  services text[],
  is_active boolean DEFAULT true,
  created_at timestamptz
);
```

**إمكانية القراءة:**
- متاح للجميع (Public Read)
- فلترة حسب شركة التأمين والفئة
- بحث بالمدينة والخدمة

---

### 5. `medical_documents` - أرشيف المستندات

```sql
CREATE TABLE medical_documents (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  document_type text NOT NULL,
  document_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  upload_date timestamptz,
  related_request_id uuid,
  is_encrypted boolean DEFAULT true,
  ai_summary text,
  tags text[],
  folder text DEFAULT 'general',
  created_at timestamptz
);
```

**الميزات:**
- تصنيف حسب النوع (report, xray, bill, approval, prescription)
- ربط بطلب الموافقة
- تشفير الملفات
- ملخص AI للمستند
- نظام Tags للبحث السريع
- تنظيم في مجلدات

---

## 🔐 الأمان والخصوصية

### 1. Row Level Security (RLS)

**سياسات الأمان المطبقة:**

```sql
-- المستخدمون يرون بياناتهم فقط
CREATE POLICY "Users can view own insurance details"
  ON insurance_details FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- المستخدمون يمكنهم إنشاء طلبات فقط لأنفسهم
CREATE POLICY "Users can create insurance requests"
  ON insurance_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

### 2. تشفير البيانات

- **صور البطاقات**: مشفرة في Supabase Storage
- **المستندات الطبية**: `is_encrypted = true`
- **بيانات الموافقات**: محمية بـ RLS
- **نقل البيانات**: HTTPS فقط

### 3. إقرار إخلاء المسؤولية

**نص قانوني إلزامي:**
> "مُعافى وسيط لتسهيل متابعة الموافقات، والقرار النهائي يعود لشركة التأمين حسب شروط بوليصتك."

**الموقع:** أسفل الصفحة في بطاقة تحذير صفراء

---

## 🎨 واجهة المستخدم (UI/UX)

### التصميم العام:

**الألوان الرئيسية:**
- **الأزرق السماوي** `#0ea5e9` - اللون الأساسي
- **الأخضر** `#10b981` - الموافقات
- **الأحمر** `#ef4444` - الرفض
- **البرتقالي** `#f59e0b` - قيد المراجعة
- **البنفسجي** `#8b5cf6` - الاعتراضات

### مكونات التصميم:

#### 1. بطاقة التأمين الرقمية:
```typescript
- خلفية زرقاء متدرجة
- أيقونة Shield
- رقم البوليصة وتاريخ الانتهاء
- badge لفئة التأمين
- زر "شبكة الفروع"
- تأثير Gradient في الخلفية
```

#### 2. خط تتبع الموافقات:
```typescript
- 3 نقاط متصلة بخطوط
- تلوين حسب الحالة
- نص توضيحي تحت كل نقطة
- Animated (قابل للتطوير)
```

#### 3. Tabs للتبويبات:
```typescript
- تبويبة "الموافقات" (Shield Icon)
- تبويبة "الأرشيف" (FolderOpen Icon)
- تصميم Material Design
- لون نشط وغير نشط
```

#### 4. المجلدات:
```typescript
- Grid Layout (2 أعمدة)
- أيقونة FolderOpen
- اسم المجلد + العدد
- Border خفيف
```

---

## ⚡ Edge Functions

### `simplify-medical-report`

**الوظيفة:** تبسيط التقارير الطبية بالذكاء الاصطناعي

**المدخلات:**
```json
{
  "documentId": "uuid",
  "reportText": "نص التقرير الطبي",
  "reportType": "report | xray | lab_test",
  "language": "ar | en"
}
```

**المخرجات:**
```json
{
  "documentId": "uuid",
  "summary": "الملخص المبسط",
  "keyTerms": ["مصطلح1", "مصطلح2"],
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**التقنيات المستخدمة:**
- OpenAI GPT-4 API
- معالجة اللغة الطبيعية (NLP)
- دعم العربية والإنجليزية

**الحماية:**
- JWT Authentication
- CORS Headers
- Rate Limiting (قابل للإضافة)

---

## 🔗 الربط مع الأنظمة الأخرى

### 1. الربط مع نظام الجلسات:

عند حجز جلسة في `/telehealth/book-appointment`:
```typescript
// تلقائياً يتم إنشاء طلب موافقة
const { data } = await supabase
  .from('insurance_requests')
  .insert({
    user_id: user.id,
    request_type: 'appointment',
    related_id: appointment.id,
    status: 'submitted'
  });
```

### 2. الربط مع الصيدليات:

عند طلب دواء:
```typescript
// تلقائياً يتم إنشاء طلب موافقة للدواء
const { data } = await supabase
  .from('insurance_requests')
  .insert({
    user_id: user.id,
    request_type: 'medication',
    related_id: medication.id,
    status: 'submitted'
  });
```

### 3. الربط مع المستشفيات (قابل للتطوير):

**API خاص للمستشفيات:**
```typescript
// المستشفى يحدث حالة الموافقة مباشرة
POST /api/hospital/update-approval
{
  "requestId": "uuid",
  "status": "approved",
  "approvalNumber": "APR-2024-001"
}
```

---

## 📊 سير العمل الكامل (Complete Workflow)

### مثال: جلسة طبية

```
1. المستخدم يحجز جلسة طبية
   ↓
2. يتم إنشاء طلب موافقة تلقائياً
   (status: submitted)
   ↓
3. شركة التأمين تراجع الطلب
   (status: under_review)
   ↓
4. القرار:

   ✅ موافقة:
   - status: approved
   - approval_number: APR-2024-001
   - إشعار للمستخدم
   - تفعيل الجلسة

   ✗ رفض:
   - status: rejected
   - rejection_reason: "سبب الرفض"
   - إشعار للمستخدم
   - زر "تقديم اعتراض" يظهر

   ⚖️ اعتراض:
   - status: appealed
   - المستخدم يرفع مستندات إضافية
   - إعادة المراجعة
```

---

## 🎯 الميزات التنافسية

### لماذا هذا النظام "ثوري"؟

#### 1. **تجربة Apple Wallet**
- بطاقة رقمية جميلة
- سهولة الوصول
- تصميم احترافي

#### 2. **تتبع ذكي**
- خط تتبع مرئي
- تحديثات لحظية
- شفافية كاملة

#### 3. **الذكاء الاصطناعي**
- تبسيط التقارير
- شرح بلغة بسيطة
- تحليل ذكي

#### 4. **نظام الاعتراضات**
- حق قانوني للمريض
- سهولة التقديم
- متابعة دقيقة

#### 5. **الأرشفة الذكية**
- تنظيم تلقائي
- بحث سريع
- مجلدات ذكية

#### 6. **التكامل الشامل**
- ربط مع الجلسات
- ربط مع الصيدليات
- ربط مع المستشفيات

---

## 📱 الصفحات والمسارات (Routes)

### الصفحات الرئيسية:

```
/app/(tabs)/reports.tsx
  → المحفظة الصحية الرئيسية
  → البطاقة الرقمية
  → تبويبات (الموافقات / الأرشيف)

/app/reports/submit.tsx
  → رفع تقرير جديد أو طلب موافقة

/app/reports/history.tsx
  → تاريخ التقارير والمستندات

/app/reports/appeal.tsx
  → تقديم اعتراض على رفض

/app/reports/insurance.tsx
  → إضافة/تعديل بطاقة التأمين

/app/reports/health-approvals.tsx
  → شبكة الفروع المغطاة (خريطة)
```

---

## 🚀 المستقبل والتطوير

### ميزات قابلة للإضافة:

1. **إشعارات Push**
   - تنبيهات فورية عند تغيير الحالة
   - تذكير قبل انتهاء التأمين

2. **Chatbot للدعم**
   - الرد على أسئلة التأمين
   - شرح شروط التغطية

3. **OCR للبطاقات**
   - مسح البطاقة بالكاميرا
   - استخراج البيانات تلقائياً

4. **تكامل مع Apple/Google Wallet**
   - حفظ البطاقة في المحفظة الرقمية

5. **تقارير تحليلية**
   - إحصائيات الاستخدام
   - تقارير المصاريف السنوية

6. **مقارنة التأمينات**
   - مقارنة بين الشركات
   - توصيات ذكية

---

## ✅ الاختبار والتحقق

### تم الاختبار:
- ✅ البناء نجح بدون أخطاء
- ✅ قاعدة البيانات مُنشأة بنجاح
- ✅ Edge Functions مُنشرة
- ✅ Row Level Security مُفعّل
- ✅ جميع الواجهات تعمل

### للتحقق من النظام:
1. أضف بطاقة تأمين جديدة
2. أنشئ طلب موافقة
3. تتبع حالة الطلب
4. جرب رفع مستند
5. استخدم ميزة "تبسيط التقرير"
6. تحقق من شبكة الفروع

---

## 📖 الخلاصة

تم تطوير **"المحفظة الصحية"** - نظام شامل ومتكامل يضع **مُعافى** في مقدمة التطبيقات الصحية الرقمية. النظام يجمع بين:

- 💳 **بطاقة تأمين رقمية** بتصميم Apple Wallet
- 📋 **تتبع ذكي للموافقات** بخط تتبع مرئي
- ⚖️ **نظام اعتراضات قانوني** يحمي حقوق المريض
- 📁 **أرشفة ذكية** مع مجلدات منظمة
- ✨ **ذكاء اصطناعي** لتبسيط التقارير
- 🏥 **شبكة فروع متكاملة** مع المنشآت المغطاة
- 🔒 **أمان عالي** بتشفير وRLS

**النتيجة:** تجربة رقمية سلسة تحول إدارة التأمين الصحي إلى متعة! 🎉
