# دليل المساعد الصحي الذكي - AI Health Assistant Guide

## نظرة عامة | Overview

تم تطوير نظام المساعد الصحي الذكي باستخدام OpenAI API مع التزام صارم بالمعايير القانونية والطبية. النظام مصمم خصيصاً لتطبيق مُعافى الصحي.

## المكونات الأساسية | Core Components

### 1. قاعدة البيانات | Database Schema

#### جدول المحادثات - `chat_conversations`
```sql
- id: uuid (معرف فريد)
- user_id: uuid (مرتبط بالمستخدم)
- title: text (عنوان المحادثة)
- language: text (اللغة المكتشفة: ar, en, ar-sa)
- last_message_at: timestamptz (آخر رسالة)
- created_at, updated_at: timestamptz
```

#### جدول الرسائل - `chat_messages`
```sql
- id: uuid (معرف فريد)
- conversation_id: uuid (مرتبط بالمحادثة)
- role: text (user, assistant, system)
- content: text (محتوى الرسالة)
- severity_level: text (mild, moderate, severe, emergency, none)
- suggested_action: text (الإجراء المقترح)
- app_features_mentioned: text[] (مميزات التطبيق المذكورة)
- created_at: timestamptz
```

### 2. Edge Function - `health-chatbot`

#### الموقع
```
supabase/functions/health-chatbot/index.ts
```

#### الميزات الرئيسية

**أ. إخلاء المسؤولية القانوني (Legal Shield)**
- رسالة ترحيبية في بداية كل محادثة جديدة
- تنبيه واضح أن الإرشادات توعوية فقط
- توجيه للاستشارة الطبية في الحالات الحساسة

**ب. نطاق العمل المحدد (Focused Scope)**
- متخصص فقط في المواضيع الصحية والطبية والرياضية والغذائية
- يرفض بأدب المواضيع غير الصحية (سياسة، ترفيه، إلخ)

**ج. متعدد اللغات (Multilingual)**
- كشف تلقائي للغة (عربي فصيح، عامية سعودية، إنجليزي)
- الرد بنفس لغة المستخدم

**د. تحليل الأعراض (Symptom Analysis)**
- تصنيف شدة الأعراض:
  - `mild`: خفيف (صداع بسيط، تعب خفيف)
  - `moderate`: متوسط (ألم مستمر، حمى)
  - `severe`: حاد (ألم شديد، حمى عالية)
  - `emergency`: طوارئ (ألم صدر، صعوبة تنفس، نزيف حاد)

**هـ. التكامل مع مميزات التطبيق (App Integration)**
يربط الإجابات تلقائياً بمميزات التطبيق:
- الصيدلية الذكية (pharmacy)
- السجلات الصحية (records)
- الجلسات الافتراضية (virtual_sessions)
- اللياقة الذكية (fitness)
- التأمين الصحي (insurance)

### 3. واجهة المستخدم | User Interface

#### الموقع
```
app/(tabs)/ai-doctor.tsx
```

#### المميزات
- واجهة دردشة سلسة وسريعة
- عرض حالة شدة الأعراض بألوان مميزة
- اقتراحات الإجراءات المطلوبة
- دعم كامل للغة العربية والإنجليزية
- مؤشرات أثناء الكتابة
- إمكانية إنشاء محادثات متعددة

## الإعدادات المطلوبة | Required Configuration

### 1. مفتاح OpenAI API

في ملف `.env`:
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

للحصول على المفتاح:
1. سجل في [OpenAI Platform](https://platform.openai.com/)
2. اذهب إلى [API Keys](https://platform.openai.com/api-keys)
3. انقر "Create new secret key"
4. انسخ المفتاح (يبدأ بـ `sk-`)

### 2. نشر Edge Function

تم نشر الـ Edge Function تلقائياً على Supabase. للتحديثات المستقبلية، استخدم:
```bash
# سيتم عمل ذلك تلقائياً عبر أدوات التطوير
```

## كيفية الاستخدام | How to Use

### 1. للمستخدمين

1. افتح التطبيق وانتقل إلى تاب "الطبيب الذكي"
2. ابدأ محادثة جديدة
3. اطرح استفساراتك الصحية بحرية
4. ستتلقى إجابات مفصلة مع تصنيف الأعراض
5. في الحالات الخطيرة، سيوجهك البوت لحجز جلسة مع طبيب

### 2. للمطورين

#### إضافة رسالة للمحادثة
```typescript
const { data, error } = await supabase
  .from('chat_messages')
  .insert({
    conversation_id: conversationId,
    role: 'user',
    content: userMessage,
  });
```

#### استدعاء Edge Function
```typescript
const response = await fetch(
  `${supabaseUrl}/functions/v1/health-chatbot`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [...],
      conversationId: 'xxx',
      isNewConversation: false,
    }),
  }
);
```

## الأمان والخصوصية | Security & Privacy

### 1. أمان البيانات
- جميع المحادثات محمية بـ RLS (Row Level Security)
- كل مستخدم يرى محادثاته فقط
- لا يمكن لمستخدم الوصول لمحادثات مستخدم آخر

### 2. خصوصية المعلومات الطبية
- لا يتم مشاركة البيانات مع جهات خارجية
- جميع الاتصالات مشفرة (HTTPS)
- البيانات مخزنة بشكل آمن في Supabase

### 3. الامتثال القانوني
- إخلاء مسؤولية واضح في كل محادثة
- عدم تقديم تشخيص طبي نهائي
- التوجيه للأطباء في الحالات الحرجة

## أمثلة الاستخدام | Usage Examples

### مثال 1: استفسار بسيط
```
المستخدم: عندي صداع خفيف، ماذا أفعل؟
البوت: الصداع الخفيف قد يكون بسبب...
      [تصنيف: mild]
      [اقتراح: شرب الماء والراحة]
```

### مثال 2: حالة متوسطة
```
المستخدم: عندي حمى من يومين
البوت: الحمى المستمرة تحتاج متابعة...
      [تصنيف: moderate]
      [اقتراح: مراقبة الأعراض وحجز جلسة إذا استمرت]
      [ميزة مذكورة: virtual_sessions]
```

### مثال 3: حالة طارئة
```
المستخدم: ألم شديد في الصدر
البوت: هذا قد يكون حالة طوارئ!
      [تصنيف: emergency]
      [اقتراح: اتصل بالإسعاف فوراً]
```

## الصيانة والتحديثات | Maintenance & Updates

### تحديث System Prompt
لتعديل سلوك البوت، عدّل `SYSTEM_PROMPT` في:
```
supabase/functions/health-chatbot/index.ts
```

### إضافة ميزات جديدة
1. عدّل `analyzeResponse()` function
2. أضف الكلمات المفتاحية الجديدة
3. حدّث التصنيفات حسب الحاجة

### مراقبة الأداء
- تحقق من استهلاك OpenAI API
- راقب أوقات الاستجابة
- تتبع الأخطاء في Supabase Dashboard

## الأسئلة الشائعة | FAQ

**س: هل يمكن للبوت تشخيص الأمراض؟**
ج: لا، البوت يقدم إرشادات توعوية فقط. التشخيص يتطلب استشارة طبيب مختص.

**س: ماذا لو كانت حالتي طارئة؟**
ج: البوت سيوجهك فوراً للاتصال بالإسعاف في حالات الطوارئ.

**س: هل المحادثات سرية؟**
ج: نعم، جميع المحادثات محمية ومشفرة ولا يمكن لأحد غيرك الوصول إليها.

**س: كم تكلفة استخدام البوت؟**
ج: يعتمد على استهلاك OpenAI API. الاستخدام المتوسط منخفض التكلفة جداً.

## الدعم الفني | Technical Support

للمساعدة أو الإبلاغ عن مشاكل:
1. تحقق من سجلات Supabase Dashboard
2. راجع استجابة Edge Function
3. تأكد من صحة مفتاح OpenAI API

---

**تاريخ آخر تحديث:** ديسمبر 2025
**الإصدار:** 1.0.0
**الحالة:** جاهز للإنتاج ✅
