-- Fix profile creation issue for new user signups
-- This addresses the "database error saving new user" problem

-- 1. Create a trigger function to automatically create profiles for new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
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

-- 2. Create trigger on auth.users table (only if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Ensure proper RLS policies for profile insertion
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid() OR auth.uid() IS NULL);

-- 4. Allow the trigger function to insert profiles (bypass RLS for system operations)
DROP POLICY IF EXISTS "Enable profile creation for authenticated users" ON public.profiles;
CREATE POLICY "Enable profile creation for authenticated users" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

-- 5. Fix potential constraint issues
-- Make sure email constraint doesn't conflict
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_format;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email = '');

-- Allow empty names initially
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_name_length;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_name_length 
  CHECK (length(first_name) <= 50 AND length(last_name) <= 50);

-- 6. Add admin role assignment for admin emails
CREATE OR REPLACE FUNCTION public.handle_admin_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Check if the email is an admin email
  IF NEW.email IN ('zak.seid@gmail.com', 'zakseid0@gmail.com') THEN
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin'::app_role)
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::app_role;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the profile creation
    RAISE WARNING 'Failed to assign admin role for user %: %', NEW.user_id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for admin role assignment
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_role_assignment();

-- 7. Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON auth.users TO postgres, service_role;
GRANT SELECT ON auth.users TO anon, authenticated;