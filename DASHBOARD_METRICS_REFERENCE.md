# Owner Portal Dashboard - Metrics Reference Guide

## Quick Metrics Lookup

### Activity Page Metrics
```
┌─────────────────────────────────────────────────────────────┐
│ New Users              │ Users created today                │
├─────────────────────────────────────────────────────────────┤
│ Active User Logins     │ Users who logged in today          │
├─────────────────────────────────────────────────────────────┤
│ New Subscriptions      │ Subscriptions created today        │
├─────────────────────────────────────────────────────────────┤
│ Daily Revenue          │ Completed payments (today)         │
├─────────────────────────────────────────────────────────────┤
│ Appointment Sessions   │ Appointments scheduled today       │
├─────────────────────────────────────────────────────────────┤
│ New Businesses         │ Business registrations (today)     │
├─────────────────────────────────────────────────────────────┤
│ Chat Conversations     │ AI conversations (today)           │
├─────────────────────────────────────────────────────────────┤
│ Total Login Count      │ Total logins across platform       │
├─────────────────────────────────────────────────────────────┤
│ Hourly Activity Chart  │ User registrations per hour (24hr) │
└─────────────────────────────────────────────────────────────┘
```

### Operations Page Metrics
```
┌─────────────────────────────────────────────────────────────┐
│ Total Operations       │ Last 15 combined operations        │
├─────────────────────────────────────────────────────────────┤
│ Success Rate           │ % of successful operations         │
├─────────────────────────────────────────────────────────────┤
│ Avg Response Time      │ Average operation response (ms)    │
├─────────────────────────────────────────────────────────────┤
│ User Registrations     │ New user sign-ups                  │
├─────────────────────────────────────────────────────────────┤
│ Appointments           │ Session scheduling                 │
├─────────────────────────────────────────────────────────────┤
│ Payment Transactions   │ Payment processing events          │
├─────────────────────────────────────────────────────────────┤
│ Business Onboarding    │ New business registrations         │
├─────────────────────────────────────────────────────────────┤
│ Chat Interactions      │ AI chatbot conversations           │
└─────────────────────────────────────────────────────────────┘
```

### Services Page Metrics
```
┌─────────────────────────────────────────────────────────────┐
│ Total Services         │ 6 monitored system services        │
├─────────────────────────────────────────────────────────────┤
│ Active Services        │ Services currently operational     │
├─────────────────────────────────────────────────────────────┤
│ Average Uptime %       │ Mean uptime across all services    │
├─────────────────────────────────────────────────────────────┤
│ Avg Response Time (ms) │ Mean response time for requests    │
├─────────────────────────────────────────────────────────────┤
│ Database Service       │ Primary data storage system        │
├─────────────────────────────────────────────────────────────┤
│ Authentication         │ User login & authorization system │
├─────────────────────────────────────────────────────────────┤
│ Payment Processing     │ Transaction handling service       │
├─────────────────────────────────────────────────────────────┤
│ Application Server     │ Main app backend service           │
├─────────────────────────────────────────────────────────────┤
│ Email Service          │ Email notification system          │
├─────────────────────────────────────────────────────────────┤
│ Storage System         │ File & blob storage service        │
└─────────────────────────────────────────────────────────────┘
```

### Alerts Page Metrics
```
┌─────────────────────────────────────────────────────────────┐
│ Critical Alerts        │ Error-level system issues          │
├─────────────────────────────────────────────────────────────┤
│ Warnings               │ Warning-level alerts               │
├─────────────────────────────────────────────────────────────┤
│ Info Alerts            │ Informational notifications        │
├─────────────────────────────────────────────────────────────┤
│ Success Alerts         │ Positive system status             │
├─────────────────────────────────────────────────────────────┤
│ Pending Registrations  │ Businesses awaiting approval       │
├─────────────────────────────────────────────────────────────┤
│ In-Progress Sessions   │ Ongoing appointment sessions       │
├─────────────────────────────────────────────────────────────┤
│ Failed Payments        │ Payment processing failures        │
├─────────────────────────────────────────────────────────────┤
│ New Users (24h)        │ User registrations in last 24 hrs  │
├─────────────────────────────────────────────────────────────┤
│ Inactive Businesses    │ Businesses needing reactivation    │
└─────────────────────────────────────────────────────────────┘
```

### Main Dashboard Metrics
```
┌─────────────────────────────────────────────────────────────┐
│ Total Users            │ All registered platform users      │
├─────────────────────────────────────────────────────────────┤
│ Today's Operations     │ Daily appointment sessions         │
├─────────────────────────────────────────────────────────────┤
│ Total Commission       │ 10% of completed revenue           │
├─────────────────────────────────────────────────────────────┤
│ Active Businesses      │ Registered business partners       │
├─────────────────────────────────────────────────────────────┤
│ Weekly Growth          │ 7-day user registration trend      │
├─────────────────────────────────────────────────────────────┤
│ Revenue Distribution   │ Hospital vs Pharmacy split (%)     │
├─────────────────────────────────────────────────────────────┤
│ Total Chats            │ AI conversation count              │
├─────────────────────────────────────────────────────────────┤
│ Successful Referrals   │ Completed appointments             │
├─────────────────────────────────────────────────────────────┤
│ Conversion Rate        │ Referral success rate (%)          │
├─────────────────────────────────────────────────────────────┤
│ Recent Alerts          │ Dynamic system notifications       │
├─────────────────────────────────────────────────────────────┤
│ Recent Referrals       │ Latest 5 appointment sessions      │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Source Mapping

### From `users` Table
```
Activity Page:
  ├─ New Users (24h)
  ├─ Active Users (last sign-in 24h)
  └─ Hourly breakdown (new registrations by hour)

Operations Page:
  └─ User registrations (latest 5)

Alerts Page:
  └─ New Users (last 24 hours)

Main Dashboard:
  └─ Total users count
```

### From `appointments` Table
```
Activity Page:
  └─ Appointment sessions (24h)

Operations Page:
  ├─ Latest 5 appointments
  └─ Status tracking

Alerts Page:
  └─ In-progress appointments count

Main Dashboard:
  ├─ Today's operations
  └─ Completed appointments count
```

### From `payments` Table
```
Activity Page:
  └─ Daily revenue (completed payments)

Operations Page:
  └─ Latest 5 payments

Alerts Page:
  └─ Failed payments count

Main Dashboard:
  ├─ Commission calculation (10% of revenue)
  └─ Revenue distribution
```

### From `business_registrations` Table
```
Activity Page:
  └─ New businesses (24h)

Operations Page:
  └─ Latest 5 registrations

Alerts Page:
  ├─ Pending businesses
  └─ Inactive businesses

Main Dashboard:
  └─ Active businesses count
```

### From `chat_conversations` Table
```
Activity Page:
  └─ Chat conversations (24h)

Operations Page:
  └─ Latest 3 chats

Main Dashboard:
  ├─ Total chats
  └─ Conversion rate calculation
```

### From `subscriptions` Table
```
Main Dashboard:
  └─ Active subscriptions count
```

### From `system_status` Table (Mock if Empty)
```
Services Page:
  ├─ Service names
  ├─ Status (active/warning/error/maintenance)
  ├─ Response times (ms)
  ├─ Uptime percentages (%)
  └─ Last check timestamps
```

---

## Metric Calculation Formulas

### Commission
```
Total Commission = Sum of completed payments × 0.10 (10%)
```

### Revenue Distribution
```
Hospital Revenue = Total Revenue × 0.60
Pharmacy Revenue = Total Revenue × 0.40
```

### Conversion Rate
```
Conversion Rate % = (Completed Appointments / Total Chats) × 100
```

### Success Rate (Operations)
```
Success Rate % = (Successful Operations / Total Operations) × 100
Success = status is 'success', 'completed', or 'active'
```

### Service Metrics
```
Average Uptime = Mean of all service uptime percentages
Average Response Time = Mean of all response times (ms)
```

### Alert Summary
```
Critical Count = Count of alerts with type = 'error'
Warning Count = Count of alerts with type = 'warning'
Info Count = Count of alerts with type = 'info'
Success Count = Count of alerts with type = 'success'
```

---

## Database Query Patterns

### Count-Only Query (Optimized)
```typescript
supabase
  .from('table_name')
  .select('*', { count: 'exact', head: true })
  .eq('column', 'value')
```
Returns: `{ count: number, data: null }`

### Data Query with Limit
```typescript
supabase
  .from('table_name')
  .select('column1, column2, column3')
  .order('created_at', { ascending: false })
  .limit(5)
```
Returns: Array of 5 records

### Date Range Query
```typescript
supabase
  .from('table_name')
  .select('*', { count: 'exact', head: true })
  .gte('created_at', startDate.toISOString())
  .lt('created_at', endDate.toISOString())
```
Returns: Count of records in date range

### Parallel Query Execution
```typescript
Promise.all([
  query1,
  query2,
  query3,
  query4,
  query5,
  query6,
])
```
Executes all queries simultaneously for performance

---

## Update Frequency

| Metric | Update Frequency | Trigger |
|--------|-----------------|---------|
| All Metrics | Manual | User pulls-to-refresh |
| All Metrics | Automatic | Component mount |
| All Metrics | None | No polling (performance) |

---

## Performance Notes

- Initial Load: 1-2 seconds (6-7 parallel queries)
- Refresh Load: 500-800ms (cached data reuse)
- Query Type: Count-only queries (minimal data)
- Memory: Optimized with React hooks
- Network: Indexed column scans

---

## Metric Refresh Checklist

Before deploying to production:

- [ ] Verify all 6+ database tables are accessible
- [ ] Test with production data volume
- [ ] Confirm all calculations are correct
- [ ] Check Arabic text display and formatting
- [ ] Verify currency formatting (SAR)
- [ ] Test pull-to-refresh on all pages
- [ ] Confirm load times are acceptable
- [ ] Check error handling for empty tables
- [ ] Verify status color coding
- [ ] Test on mobile devices

