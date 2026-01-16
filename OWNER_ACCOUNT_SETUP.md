# Owner Account Setup - Complete Guide

Your account **ali@muaafa.com** needs to be created in the Supabase authentication system. Here's how to do it.

---

## Current Status

Based on database verification:
- ✅ Database schema is ready
- ✅ `admin_users` table exists
- ✅ `users` table exists
- ❌ **Account ali@muaafa.com NOT FOUND in auth.users**
- ❌ **Account needs to be created**

---

## IMPORTANT: Why Your SQL Commands Didn't Work

You mentioned you ran SQL commands to create the account. However:

1. **auth.users is a protected table** - You cannot insert directly into `auth.users` using regular SQL
2. **You must use Supabase Admin API** - Account creation requires the `service_role` key
3. **Only certain methods work:**
   - ✅ Supabase Dashboard (manual creation)
   - ✅ Admin API with service_role key
   - ✅ Our automated script
   - ❌ Direct SQL INSERT (won't work)

---

## Method 1: Automatic Script (RECOMMENDED)

### Step 1: Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/gtoezhrtnsykixgyxzte/settings/api
2. Find **service_role** key (secret key, starts with `eyJ...`)
3. Copy it (keep it secret!)

### Step 2: Add to .env File

Open your `.env` file and add:

```bash
# Add this line to your .env file
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_full_key_here
```

### Step 3: Run The Script

```bash
npm run create-owner
```

This will:
- ✅ Create account in `auth.users`
- ✅ Add record in `users` table
- ✅ Add record in `admin_users` table with owner role
- ✅ Grant all permissions

### Expected Output:

```
Creating owner account...
Email: ali@muaafa.com
Auth user created: <user-id>
User record created
Admin record created with owner role

Owner account created successfully!
Email: ali@muaafa.com
Password: Alluosh12
User ID: <user-id>
```

---

## Method 2: Manual Creation (If Script Fails)

### Step 1: Create Authentication Account

1. Go to: https://supabase.com/dashboard/project/gtoezhrtnsykixgyxzte/auth/users
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email:** `ali@muaafa.com`
   - **Password:** `Alluosh12`
   - **✅ Auto Confirm User** (IMPORTANT - check this box!)
4. Click **Create user**
5. **Copy the User UID** (you'll need it next)

### Step 2: Add to users Table

1. Go to: https://supabase.com/dashboard/project/gtoezhrtnsykixgyxzte/editor
2. Open **users** table
3. Click **Insert** → **Insert row**
4. Fill in:
   - **id:** Paste the User UID from Step 1
   - **full_name:** `Ali - Owner`
   - **phone:** `+966500000000`
   - **language:** `ar`
5. Click **Save**

### Step 3: Add to admin_users Table

1. In Table Editor, open **admin_users** table
2. Click **Insert** → **Insert row**
3. Fill in:
   - **id:** Same User UID
   - **role:** `owner`
   - **permissions:** Click field, select **Edit as JSON**, paste:

```json
["all", "users:read", "users:write", "users:delete", "businesses:read", "businesses:write", "businesses:delete", "sessions:read", "sessions:write", "sessions:delete", "pharmacies:read", "pharmacies:write", "pharmacies:delete", "reports:read", "reports:write", "subscriptions:read", "subscriptions:write", "admin:full_access"]
```

4. Click **Save**

---

## Method 3: SQL Helper (After Creating Auth Account)

If you created the account in Step 1 of Method 2, you can use SQL for the rest:

```sql
-- Replace 'YOUR_USER_UUID' with the actual UUID from auth.users

-- Step 1: Add to users table
INSERT INTO users (id, full_name, phone, language)
VALUES (
  'YOUR_USER_UUID',
  'Ali - Owner',
  '+966500000000',
  'ar'
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Add to admin_users table
INSERT INTO admin_users (id, role, permissions)
VALUES (
  'YOUR_USER_UUID',
  'owner',
  ARRAY[
    'all',
    'users:read',
    'users:write',
    'users:delete',
    'businesses:read',
    'businesses:write',
    'businesses:delete',
    'sessions:read',
    'sessions:write',
    'sessions:delete',
    'pharmacies:read',
    'pharmacies:write',
    'pharmacies:delete',
    'reports:read',
    'reports:write',
    'subscriptions:read',
    'subscriptions:write',
    'admin:full_access'
  ]
)
ON CONFLICT (id) DO UPDATE
SET role = EXCLUDED.role, permissions = EXCLUDED.permissions;
```

---

## Verification Steps

After creating the account, verify it worked:

### 1. Check auth.users

```sql
SELECT id, email, created_at
FROM auth.users
WHERE email = 'ali@muaafa.com';
```

Should return 1 row with your user.

### 2. Check users table

```sql
SELECT id, full_name, phone
FROM users
WHERE id = (SELECT id FROM auth.users WHERE email = 'ali@muaafa.com');
```

Should show: `Ali - Owner`

### 3. Check admin_users table

```sql
SELECT id, role, permissions
FROM admin_users
WHERE id = (SELECT id FROM auth.users WHERE email = 'ali@muaafa.com');
```

Should show: `role: owner`, with all permissions

---

## Login After Creation

### Web Login URL:
```
http://localhost:8081/auth/login
```

### Credentials:
- **Email:** `ali@muaafa.com`
- **Password:** `Alluosh12`

### What You'll Have Access To:

✅ **Main App** - All individual features
✅ **Admin Dashboard** - `/admin/`
  - User management
  - Session management
  - System settings
  - Full control
✅ **Business Portal** - `/business/`
  - All business features
  - Pharmacy management
  - Delivery tracking
  - Insurance portal

---

## Troubleshooting

### Error: "User already exists"

If the script says user exists:
1. Go to Supabase Dashboard
2. Find the user in Authentication > Users
3. Reset the password to `Alluosh12`
4. Continue with Steps 2 & 3 of Manual Creation

### Error: "Invalid email or password" (after creation)

1. Check email is exactly: `ali@muaafa.com` (lowercase)
2. Check password is exactly: `Alluosh12` (case-sensitive)
3. Verify email is confirmed in Supabase Dashboard
4. Try password reset if needed

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY"

The service role key is not in `.env` file:
1. Get it from Supabase Dashboard
2. Add to `.env` file (see Method 1, Step 2)
3. **Never commit this key to git!**

### Can't Access Admin Dashboard

Check these:
1. ✅ Account exists in `auth.users`
2. ✅ Account exists in `admin_users` table
3. ✅ Role is set to `owner` (not `admin` or `moderator`)
4. ✅ You're logged in to the app
5. Try clearing cache and logging in again

---

## Security Notes

⚠️ **CRITICAL SECURITY:**

1. **Service Role Key:**
   - Keep it SECRET
   - Never share it
   - Never commit to git
   - Only use it locally
   - Delete from `.env` after account creation

2. **Password:**
   - Change `Alluosh12` after first login
   - Use a strong, unique password
   - Enable 2FA if available

3. **Owner Account:**
   - This account has FULL ACCESS
   - Can modify/delete everything
   - Handle with care
   - Don't share credentials

---

## Next Steps After Account Creation

1. ✅ Login at `/auth/login`
2. ✅ Change your password in Settings
3. ✅ Access Admin Dashboard at `/admin/`
4. ✅ Access Business Portal at `/business/`
5. ✅ Test all features
6. ✅ Remove `SUPABASE_SERVICE_ROLE_KEY` from `.env`

---

## Support

If you encounter issues:
1. Check the console for errors (F12 in browser)
2. Check Supabase logs in Dashboard
3. Verify all SQL queries ran successfully
4. Review this guide step by step
5. Make sure you're using the correct credentials

---

## Quick Start Checklist

- [ ] Get service_role key from Supabase
- [ ] Add key to `.env` file
- [ ] Run `npm run create-owner`
- [ ] Verify account in database
- [ ] Login with ali@muaafa.com / Alluosh12
- [ ] Change password
- [ ] Remove service_role key from `.env`
- [ ] Test admin access

---

**That's it! Your owner account will be ready with full admin access.**
