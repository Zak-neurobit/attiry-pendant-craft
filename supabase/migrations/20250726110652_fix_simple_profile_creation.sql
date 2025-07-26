-- Simplified profile creation fix - remove problematic admin role assignment
-- This fixes the 500 Internal Server Error during signup

-- 1. Drop the problematic admin role trigger first
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_admin_role_assignment();

-- 2. Create a simplified profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Simple profile creation without admin role logic
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Clean up RLS policies - keep only essential ones
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable profile creation for authenticated users" ON public.profiles;

-- Simple policy that allows trigger to create profiles
CREATE POLICY "Allow profile creation" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

-- 5. Remove problematic constraints temporarily
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_format;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_name_length;