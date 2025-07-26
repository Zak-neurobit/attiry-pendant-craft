-- Fixed version - Add back working profile creation and admin role assignment

-- 1. Create a simple profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create basic profile
  INSERT INTO public.profiles (user_id, email, first_name, last_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NOW(),
    NOW()
  );
  
  -- Assign admin role for admin emails (simple insert, no conflict handling)
  IF NEW.email IN ('zak.seid@gmail.com', 'zakseid0@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (NEW.id, 'admin'::app_role, NOW());
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail auth
    RAISE LOG 'Profile/role creation failed for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. For existing users without profiles, create them
INSERT INTO public.profiles (user_id, email, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.user_id IS NULL;

-- 4. Assign admin role to existing admin users (simple approach)
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('zak.seid@gmail.com', 'zakseid0@gmail.com')
);

INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  au.id,
  'admin'::app_role,
  NOW()
FROM auth.users au
WHERE au.email IN ('zak.seid@gmail.com', 'zakseid0@gmail.com');

-- 5. Success message
DO $$
BEGIN
    RAISE NOTICE 'Profile creation trigger and admin roles restored successfully';
END $$;