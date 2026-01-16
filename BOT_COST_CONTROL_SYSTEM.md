# 💰 نظام التحكم في تكلفة الطبيب الذكي

## 📊 ملخص النظام

تم تطبيق نظام شامل للتحكم في تكاليف واستهلاك الطبيب الذكي في تطبيق معافى، مع ضمان تجربة مستخدم سلسة وحماية الفاتورة من الاستخدام المفرط.

---

## ⚙️ الإعدادات المطبقة

### 1️⃣ إعدادات GPT-4o

| الإعداد | القيمة | الوصف |
|---------|--------|-------|
| **Model** | `gpt-4o` | أقوى موديل من OpenAI |
| **Max Tokens** | `300` | حد أقصى لكل إجابة (خفض من 2000) |
| **Temperature** | `0.4` | توازن بين الدقة والإبداع |
| **Top-p** | `0.9` | تحسين جودة الردود |
| **Frequency Penalty** | `0.1` | تقليل التكرار |
| **Presence Penalty** | `0.1` | تشجيع التنوع |

**التوفير المتوقع:** 85% من التكلفة (من 2000 إلى 300 token)

---

### 2️⃣ حدود الاستخدام اليومي

```typescript
Max Messages Per User Per Day: 20 رسالة
Warning Threshold: 16 رسالة (80%)
Reset Time: منتصف الليل (00:00)
```

**الفوائد:**
- حماية من الاستخدام المفرط
- توزيع عادل بين المستخدمين
- تكلفة محسوبة مسبقاً

---

### 3️⃣ Rate Limiting (حماية من الهجمات)

| النطاق | الحد الأقصى |
|--------|-------------|
| **Per Minute** | 200 طلب |
| **Per Hour** | 1,200 طلب |
| **Per Day** | 10,000 طلب |

**الحماية ضد:**
- ✅ هجمات DDoS
- ✅ البوتات والسكربتات
- ✅ الاستخدام الفيروسي
- ✅ تكاليف غير متوقعة

---

### 4️⃣ نظام Caching الذكي

```typescript
Cache Duration: 6 ساعات
Cache Key: SHA-256 hash للاستعلام
Cleanup: تلقائي عند انتهاء المدة
```

**التوفير:**
- ✅ 100% توفير في الطلبات المتشابهة
- ✅ استجابة فورية للاستعلامات المخزنة
- ✅ تقليل الحمل على OpenAI API

---

## 🔥 المزايا الجديدة

### 1. تنبيه قبل الوصول للحد الأقصى

عند وصول المستخدم لـ **80%** من الحد اليومي (16 رسالة):

```json
{
  "warning": true,
  "warning_message": "تنبيه: لديك 4 رسائل متبقية فقط اليوم."
}
```

---

### 2. رسالة عند تجاوز الحد

```json
{
  "error": "daily_limit_exceeded",
  "message": "لقد وصلت الحد الأقصى لليوم، يرجى العودة غدًا ويفتح من جديد بعد 20 ساعة.",
  "messages_used": 20,
  "reset_time": "2026-01-09T00:00:00Z"
}
```

---

### 3. تتبع شامل للاستخدام

كل استدعاء يتم تسجيله في `bot_usage_logs`:

```typescript
{
  user_id: string
  user_message: string
  bot_response: string
  tokens_used: number
  response_time_ms: number
  cached: boolean
  severity_level: string
  cost_estimate: number
  ip_address: string
  user_agent: string
  created_at: timestamp
}
```

---

## 📊 الجداول الجديدة في قاعدة البيانات

### 1. `bot_usage_tracking`
- تتبع استخدام المستخدمين يومياً
- عدد الرسائل والـ tokens المستهلكة

### 2. `bot_rate_limits`
- حماية من Rate Limiting
- تتبع الطلبات بالدقيقة/الساعة/اليوم

### 3. `bot_response_cache`
- تخزين الردود المتشابهة
- تنتهي تلقائياً بعد 6 ساعات

### 4. `bot_usage_logs`
- سجل شامل لكل العمليات
- مراقبة التكاليف والأداء

---

## 💡 دوال قاعدة البيانات

### 1. `check_user_daily_limit(user_id)`
```sql
Returns:
{
  allowed: boolean
  messages_used: number
  messages_remaining: number
  warning: boolean
  warning_message?: string
}
```

### 2. `check_rate_limit(user_id, ip_address)`
```sql
Returns:
{
  allowed: boolean
  reason?: string
  blocked_until?: timestamp
}
```

### 3. `get_cached_response(query_hash)`
```sql
Returns:
{
  cached: boolean
  response?: string
  analysis?: object
}
```

### 4. `increment_user_message_count(user_id, tokens_used)`
```sql
Updates daily usage counters
```

---

## 📈 حساب التكلفة

### صيغة الحساب:

```typescript
Input Cost:  $0.0025 / 1K tokens
Output Cost: $0.01 / 1K tokens

Average Split: 60% input, 40% output

Total Cost = (input_tokens × 0.0025/1000) + (output_tokens × 0.01/1000)
```

### مثال:
- استدعاء بـ 300 token:
  - Input: 180 tokens → $0.00045
  - Output: 120 tokens → $0.0012
  - **Total: ~$0.00165**

### التكلفة اليومية المتوقعة:
- مستخدم واحد (20 رسالة): **$0.033**
- 100 مستخدم نشط: **$3.30**
- 1000 مستخدم نشط: **$33.00**

**مع Caching:** انخفاض بنسبة 40-60% حسب الاستعلامات المتشابهة

---

## 🛡️ الحماية والأمان

### ✅ حماية من الهجمات
- Rate limiting على مستوى IP
- تتبع المستخدمين المشبوهين
- إيقاف تلقائي عند الإساءة

### ✅ حماية الخصوصية
- RLS على جميع الجداول
- المستخدمون يرون بياناتهم فقط
- تشفير الـ queries في الـ cache

### ✅ مراقبة التكاليف
- لوج شامل لكل العمليات
- تقديرات التكلفة لكل استدعاء
- تقارير يومية/شهرية

---

## 🚀 كيفية الاستخدام

### 1. من التطبيق (Client):

```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/health-chatbot`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'ما هو الصداع؟' }],
    userId: currentUser.id,
    conversationId: 'conv-123',
    isNewConversation: false
  })
});

const data = await response.json();

// التحقق من التحذيرات
if (data.warning) {
  alert(data.warning); // "لديك 4 رسائل متبقية فقط اليوم"
}

// التحقق من Cache
if (data.cached) {
  console.log('Response from cache - Free!');
}
```

### 2. استعلام الاستخدام:

```typescript
// الحصول على استخدام المستخدم اليوم
const { data } = await supabase
  .from('bot_usage_tracking')
  .select('*')
  .eq('user_id', userId)
  .eq('usage_date', new Date().toISOString().split('T')[0])
  .single();

console.log(`Messages: ${data.messages_count}/20`);
console.log(`Tokens: ${data.tokens_used}`);
```

---

## 📊 لوحة التحكم (للمالك)

يمكن للمالك مراقبة:

1. **إجمالي الاستخدام اليومي**
```sql
SELECT
  COUNT(*) as total_requests,
  SUM(tokens_used) as total_tokens,
  SUM(cost_estimate) as total_cost
FROM bot_usage_logs
WHERE created_at >= CURRENT_DATE;
```

2. **أكثر المستخدمين نشاطاً**
```sql
SELECT
  user_id,
  messages_count,
  tokens_used
FROM bot_usage_tracking
WHERE usage_date = CURRENT_DATE
ORDER BY messages_count DESC
LIMIT 10;
```

3. **معدل Cache Hit**
```sql
SELECT
  COUNT(CASE WHEN cached = true THEN 1 END) as cached_requests,
  COUNT(*) as total_requests,
  (COUNT(CASE WHEN cached = true THEN 1 END)::float / COUNT(*) * 100) as cache_hit_rate
FROM bot_usage_logs
WHERE created_at >= CURRENT_DATE;
```

---

## 🔧 الصيانة

### تنظيف الـ Cache:

```sql
-- تنظيف تلقائي للـ cache المنتهي
SELECT cleanup_expired_cache();
```

### إعادة تعيين الحدود (للاختبار):

```sql
-- إعادة تعيين استخدام مستخدم معين
DELETE FROM bot_usage_tracking
WHERE user_id = 'user-id'
AND usage_date = CURRENT_DATE;
```

---

## ✅ الخلاصة

النظام الجديد يضمن:

1. ✅ **تكلفة محسوبة مسبقاً** - 20 رسالة × 300 token × $0.00165 = $0.033/يوم/مستخدم
2. ✅ **حماية الفاتورة** - حدود يومية + Rate limiting
3. ✅ **استقرار التطبيق** - لا ضغط على API
4. ✅ **تجربة مستخدم سلسة** - تحذيرات مبكرة + cache سريع
5. ✅ **مراقبة شاملة** - لوجات كاملة لكل العمليات

---

## 📞 الدعم

للاستفسارات أو التعديلات، يرجى التواصل مع فريق التطوير.

**آخر تحديث:** 2026-01-08
