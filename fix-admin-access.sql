-- Fix admin access by assigning admin role to existing users
-- This should be run in the Supabase SQL editor as it bypasses RLS

-- First, let's see what users we have
DO $$
DECLARE
    user_record RECORD;
    admin_count INTEGER;
BEGIN
    -- Check if we have any admin users
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_roles 
    WHERE role = 'admin';
    
    RAISE NOTICE 'Current admin users: %', admin_count;
    
    -- If no admin users, assign admin role to first user
    IF admin_count = 0 THEN
        -- Get the first user from profiles
        SELECT user_id INTO user_record 
        FROM public.profiles 
        ORDER BY created_at ASC 
        LIMIT 1;
        
        IF user_record.user_id IS NOT NULL THEN
            -- Insert admin role (bypassing RLS since we're in a DO block)
            INSERT INTO public.user_roles (user_id, role, created_at)
            VALUES (user_record.user_id, 'admin'::app_role, NOW())
            ON CONFLICT (user_id) DO UPDATE SET 
                role = 'admin'::app_role,
                updated_at = NOW();
            
            RAISE NOTICE 'Admin role assigned to user: %', user_record.user_id;
        ELSE
            RAISE NOTICE 'No users found in profiles table';
        END IF;
    END IF;
    
    -- Show all current roles
    FOR user_record IN 
        SELECT ur.user_id, ur.role, p.email
        FROM public.user_roles ur
        LEFT JOIN public.profiles p ON ur.user_id = p.user_id
    LOOP
        RAISE NOTICE 'User: % (%), Role: %', user_record.email, user_record.user_id, user_record.role;
    END LOOP;
    
END $$;

-- Alternative: If the above doesn't work, manually assign admin to specific user
-- Replace 'your-email@example.com' with your actual email
/*
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT p.user_id, 'admin'::app_role, NOW()
FROM public.profiles p
WHERE p.email = 'zak.seid@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = p.user_id
)
LIMIT 1;
*/

-- Check final state
SELECT 
    ur.user_id,
    ur.role,
    p.email,
    ur.created_at
FROM public.user_roles ur
LEFT JOIN public.profiles p ON ur.user_id = p.user_id
ORDER BY ur.created_at DESC;