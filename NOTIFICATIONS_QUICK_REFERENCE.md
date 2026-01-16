# Notifications - Quick Reference Guide

## File Locations

```
/app/owner/notifications/
├── index.tsx          # Overview Dashboard
├── users.tsx          # User Notifications
├── business.tsx       # Business Notifications
├── email.tsx          # Email Campaigns
├── sms.tsx            # SMS Messages
└── logs.tsx           # Notification History

/lib/
└── notification-service.ts  # Service Layer (NEW)
```

## Database Tables

### notifications
```
- id (uuid)
- recipient_type ('users' | 'business')
- type ('email' | 'sms' | 'push')
- title (text)
- message (text)
- status ('pending' | 'delivered' | 'failed')
- user_id (uuid)
- recipient_email (varchar)
- phone_number (varchar)
- error_message (text)
- created_at (timestamp)
- sent_at (timestamp)
- read (boolean)
```

### users
```
- id (uuid)
- full_name (varchar)
- email (varchar)
- phone (varchar)
```

## Key Features by Page

### Overview (`/index.tsx`)
- 4-stat card dashboard
- Recent notifications (20)
- Global search

### Users (`/users.tsx`)
- User-specific notifications
- Read/unread tracking
- Today count
- Send button

### Business (`/business.tsx`)
- Business recipient notifications
- Delivered/Failed/Pending counts
- Sender info
- Send button

### Email (`/email.tsx`)
- Email-type notifications only
- Recipient email display
- Error messages
- Send button

### SMS (`/sms.tsx`)
- SMS-type notifications only
- Phone number display
- Error messages
- Send button

### Logs (`/logs.tsx`)
- Complete history (100 entries)
- Advanced filtering
- Type indicators
- No send (history only)

## Service Layer Functions

```typescript
// Fetch functions
getNotificationsByRecipientType(type, limit)
getNotificationsByType(type, limit)
getNotificationHistory(filters)

// Stats
getNotificationStats(recipientType?)
getEmailStats()
getSMSStats()

// CRUD Operations
sendNotification(data)
updateNotificationStatus(id, status, error?)
bulkSendNotifications(recipientType, type, title, message, recipients?)
deleteNotification(id)

// Utility
markAsRead(id)
resendNotification(id)
```

## Common Queries

### Get user notifications
```typescript
const data = await supabase
  .from('notifications')
  .select(`*, user:users(full_name, email)`)
  .eq('recipient_type', 'users')
  .order('created_at', { ascending: false })
  .limit(50);
```

### Get notification stats
```typescript
const stats = await getNotificationStats('users');
// Returns: { total, delivered, failed, pending }
```

### Send notification
```typescript
await sendNotification({
  recipient_type: 'users',
  type: 'email',
  title: 'Welcome',
  message: 'Welcome to our platform',
});
```

### Update notification status
```typescript
await updateNotificationStatus(notificationId, 'delivered');
```

## Color System

| Status | Color | Hex |
|--------|-------|-----|
| Total/Primary | Blue | #3b82f6 |
| Delivered/Success | Green | #10b981 |
| Pending | Yellow | #f59e0b |
| Failed | Red | #ef4444 |

## Icons Used

| Status | Icon | Library |
|--------|------|---------|
| Delivered | CheckCircle | lucide-react-native |
| Failed | XCircle | lucide-react-native |
| Pending | Clock | lucide-react-native |
| Search | Search | lucide-react-native |
| Send | Send | lucide-react-native |

## State Management

All pages use:
```typescript
const [loading, setLoading] = useState(true)
const [refreshing, setRefreshing] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
const [notifications, setNotifications] = useState<Type[]>([])
const [stats, setStats] = useState<NotificationStats>({...})
```

## Key Functions in Each Page

### Load Data
- `loadNotifications()` / `loadEmails()` / `loadSMS()` / `loadLogs()`
- Called on mount: `useEffect(() => { load... }, [])`
- Executes 5 queries (1 data + 4 counts)

### Refresh
- `handleRefresh()`
- Called by pull-to-refresh
- Sets refreshing state during load

### Send (except logs)
- `sendNotification()` / `sendUserNotification()` / etc.
- Creates new record
- Calls loadData again
- Error handling & logging

### Search
- `filteredNotifications` / `filteredEmails` / `filteredLogs`
- Real-time filtering
- Searches in title + message (+ type for logs)

## Performance Considerations

- All queries use `.limit()` for efficient pagination
- Separate count queries for individual stats
- Parallel execution with `Promise.all()`
- Proper error handling and logging
- RefreshControl for manual sync
- No unnecessary re-renders

## Error Handling Pattern

All functions follow:
```typescript
try {
  // Execute query
} catch (error) {
  console.error('Descriptive error message:', error);
} finally {
  setLoading(false);
  setRefreshing(false);
}
```

## Testing Tips

1. **Manual Send**: Click send button → Check database for new record
2. **Stats Verification**: Count displayed should match filtered list length
3. **Search Test**: Type in search box → Results should filter in real-time
4. **Refresh**: Pull to refresh → Data should re-fetch
5. **Status Indicators**: Verify icons match status values
6. **User Info**: Click notification → Verify user details display
7. **Timestamps**: Verify dates format in Arabic locale
8. **Empty States**: Delete all records → Empty state should appear

## Integration Example

```typescript
// In a component
import { sendNotification, getNotificationStats } from '@/lib/notification-service';

// Send notification
const notification = await sendNotification({
  recipient_type: 'users',
  type: 'push',
  title: 'New Update',
  message: 'Check out this announcement',
});

// Get latest stats
const stats = await getNotificationStats('users');
console.log(`Sent: ${stats.total}, Delivered: ${stats.delivered}`);
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No data showing | Check filters (recipient_type, type) |
| Stats not updating | Verify count queries have same filters |
| Send button not working | Check error logs in console |
| Search not filtering | Check filter logic includes all fields |
| Timestamps wrong | Verify locale is set to 'ar-SA' |
| Icons not showing | Check lucide-react-native is imported |

## Future Enhancements

- Implement pagination (currently limits to 50-100)
- Add date range filtering
- Implement bulk actions
- Add notification scheduling
- Real-time WebSocket updates
- Push notification integration
- SMS/Email service integration
- Analytics dashboard
- Export functionality
- User notification preferences

## Related Files

- Component: `/components/OwnerTabLayout.tsx`
- Config: `/lib/supabase.ts`
- Types: Defined inline in each page
- Service: `/lib/notification-service.ts`
- Styles: Defined at bottom of each page
