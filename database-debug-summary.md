# Database Debug Summary - Signup 500 Error Investigation

## Current Issue
**Error**: `POST https://jpbfprlpbiojfhshlhcp.supabase.co/auth/v1/signup 500 (Internal Server Error)`
**User Impact**: Users cannot sign up - getting "database error saving new user"

## Root Cause Analysis

### Migration Status Discovery
- **Only 2 recent migrations applied to remote database:**
  - `20250726105817_fix_profile_creation_trigger.sql`
  - `20250726110652_fix_simple_profile_creation.sql`

- **14 migration files being SKIPPED** due to incorrect naming pattern:
  - All files with format `YYYYMMDDHHMMSS-uuid.sql` are ignored
  - CLI requires format `YYYYMMDDHHMMSS_name.sql` (underscore, not dash)

### Database Structure Issues Identified

1. **Missing Core Database Schema**
   - The skipped migrations contain essential tables: `profiles`, `user_roles`, `products`, `orders`
   - Only our 2 recent trigger fixes were applied to an incomplete database
   - The `profiles` table likely doesn't exist or has wrong structure

2. **Foreign Key Constraint Missing**
   - Our trigger tries to insert into `profiles` table
   - If `profiles.user_id` lacks `REFERENCES auth.users(id)` constraint, it would fail
   - This would cause the 500 error during signup

3. **Incomplete RLS Policies**
   - Essential Row Level Security policies from base migrations not applied
   - Profile creation policies missing or incomplete

### Applied Fixes (That May Not Work)
1. **Profile Creation Trigger** - Applied but may fail due to missing table structure
2. **Simplified Trigger** - Removed admin logic but core table issues remain

## Key Files Containing Essential Schema

### Base Schema (SKIPPED):
- `20250723195049-f94abf89-a0a3-4901-80bf-36808bbb548c.sql` - Core tables and enums
- `20250724100514-75907b21-ecc0-441e-865a-ff89298fecc8.sql` - Profiles table with proper constraints

### Current Applied Triggers:
- `20250726105817_fix_profile_creation_trigger.sql` - Profile creation trigger
- `20250726110652_fix_simple_profile_creation.sql` - Simplified version

## Next Steps Required (After Docker Installation)

1. **Inspect Actual Database State**
   ```bash
   npx supabase@latest db diff --linked
   ```

2. **Check if Essential Tables Exist**
   - Verify `profiles` table exists and structure
   - Check `user_roles` table and `app_role` enum
   - Validate foreign key constraints

3. **Fix Migration History**
   - Either rename existing migration files to correct format
   - Or create comprehensive migration with all essential schema

4. **Test Signup Flow**
   - After database structure is correct
   - Verify profile creation trigger works

## Console Error Context
```
auth.ts:55  POST https://jpbfprlpbiojfhshlhcp.supabase.co/auth/v1/signup?redirect_to=http%3A%2F%2Flocalhost%3A8083%2F 500 (Internal Server Error)
```

This confirms the error is server-side during the signup process, likely when our trigger tries to create a profile in a malformed or missing `profiles` table.

## Status: Awaiting Docker Installation
Once Docker is installed, we can use `npx supabase@latest db diff --linked` to inspect the actual database schema and implement the proper fix.