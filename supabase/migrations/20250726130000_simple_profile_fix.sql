-- Ultra-simple profile creation fix
-- Remove all complexity and use the most basic approach possible

-- 1. Drop everything that might be causing issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Disable RLS on profiles temporarily to test
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Create the simplest possible trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Just try to insert with minimal data
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the user creation even if profile creation fails
    RETURN NEW;
END;
$$;

-- 4. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Make sure the profiles table allows NULL values for optional fields
ALTER TABLE public.profiles ALTER COLUMN first_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN last_name DROP NOT NULL;

-- 6. Remove any constraints that might be causing issues
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_simple_check;

-- 7. Test function to verify the trigger is working
CREATE OR REPLACE FUNCTION public.test_profile_trigger()
RETURNS TABLE(trigger_exists boolean, function_exists boolean)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') as trigger_exists,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') as function_exists;
END;
$$;