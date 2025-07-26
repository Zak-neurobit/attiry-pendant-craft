-- Temporarily remove ALL triggers to test if Supabase auth works without them
-- This will help us identify if the trigger is the problem or something else

-- Remove the trigger completely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Remove any other triggers that might interfere
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_admin_role_assignment() CASCADE;
DROP FUNCTION IF EXISTS public.assign_admin_role_if_needed(text, uuid) CASCADE;

-- Check if any other triggers exist on auth.users
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    FOR trigger_rec IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'users' 
        AND event_object_schema = 'auth'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_rec.trigger_name || ' ON auth.users';
        RAISE NOTICE 'Dropped trigger: %', trigger_rec.trigger_name;
    END LOOP;
END $$;

-- Test message
DO $$
BEGIN
    RAISE NOTICE 'All triggers removed from auth.users table. Signup should work now if triggers were the issue.';
END $$;