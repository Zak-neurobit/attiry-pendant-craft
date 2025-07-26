# Next Steps After Docker Installation

## Immediate CLI Commands to Run

### 1. Inspect Current Database State
```bash
cd "C:\Users\Hafsa\Desktop\ATTIRY LATEST\attiry-pendant-craft"
npx supabase@latest db diff --linked
```
**Purpose**: See what actually exists in the remote database

### 2. Check Schema Status
```bash
npx supabase@latest db lint --linked
```
**Purpose**: Identify any schema errors or issues

### 3. Pull Current Schema
```bash
npx supabase@latest db pull --linked
```
**Purpose**: Generate migration file showing current remote state

## Database Inspection Checklist

### Tables to Verify Exist:
- [ ] `public.profiles` - Core user profiles table
- [ ] `public.user_roles` - User role assignments
- [ ] `public.products` - Product catalog
- [ ] `public.orders` - Order management
- [ ] `public.order_items` - Order line items
- [ ] `public.site_settings` - Configuration
- [ ] `public.analytics_events` - Analytics tracking

### Enums to Verify:
- [ ] `public.app_role` - ('admin', 'user')
- [ ] `public.color_variant` - Product color options
- [ ] `public.order_status` - Order states

### Critical Constraints to Check:
- [ ] `profiles.user_id REFERENCES auth.users(id) ON DELETE CASCADE`
- [ ] `user_roles.user_id REFERENCES auth.users(id)`
- [ ] `orders.user_id REFERENCES auth.users(id)`

### Functions & Triggers to Verify:
- [ ] `public.handle_new_user()` function exists
- [ ] `on_auth_user_created` trigger on `auth.users` table
- [ ] `public.has_role()` function for RLS policies
- [ ] `update_updated_at_column()` function for timestamps

### RLS Policies to Check:
- [ ] Profile creation policies allow trigger insertion
- [ ] User can view their own profile
- [ ] Admin can view all profiles
- [ ] Product policies for public access

## Likely Fix Scenarios

### Scenario 1: Core Tables Missing
**If essential tables don't exist:**
```bash
# Create comprehensive migration with all base schema
npx supabase@latest migration new create_complete_database_schema
# Copy content from 20250723195049-f94abf89-a0a3-4901-80bf-36808bbb548c.sql
npx supabase@latest db push --linked
```

### Scenario 2: Tables Exist But Wrong Structure
**If profiles table exists but lacks foreign key:**
```bash
# Create migration to fix constraints
npx supabase@latest migration new fix_profiles_foreign_key
# Add: ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
npx supabase@latest db push --linked
```

### Scenario 3: Migration File Format Issues
**If we need to fix existing migration names:**
```bash
# Rename files to correct format:
# From: 20250723195049-f94abf89-a0a3-4901-80bf-36808bbb548c.sql
# To:   20250723195049_create_base_schema.sql
```

## Testing Procedure

### After Database Fixes:
1. **Test Signup**:
   - Go to http://localhost:8083
   - Try creating new account
   - Check browser console for errors

2. **Verify Profile Creation**:
   - Check if profile record created in database
   - Verify user_id matches auth.users.id

3. **Test Admin Assignment**:
   - Sign up with admin emails
   - Check if admin role assigned correctly

## Commands Reference
All commands should reference: `C:\Users\Hafsa\Desktop\ATTIRY LATEST\attiry-pendant-craft\SUPABASE_CLI_COMMANDS.md`

## Files to Monitor
- `supabase/migrations/` - New migration files
- Browser console - For 500 error resolution
- Database logs - For trigger execution errors

## Success Criteria
- [ ] No 500 error during signup
- [ ] Profile automatically created for new users
- [ ] Admin emails get admin role assigned
- [ ] All website functions work smoothly
- [ ] Database structure matches frontend expectations