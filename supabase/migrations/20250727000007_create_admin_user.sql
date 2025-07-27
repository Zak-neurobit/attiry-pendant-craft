-- Create admin user role for existing user
-- This will allow access to the admin products page

-- First, let's check if we have any existing users and make the first one an admin
DO $$
DECLARE
    first_user_id UUID;
    user_count INTEGER;
BEGIN
    -- Get the first user from profiles
    SELECT id INTO first_user_id 
    FROM public.profiles 
    WHERE email IS NOT NULL 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- Count total users
    SELECT COUNT(*) INTO user_count FROM public.profiles;
    
    IF first_user_id IS NOT NULL THEN
        -- Insert admin role for the first user (avoid duplicates)
        IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = first_user_id) THEN
            INSERT INTO public.user_roles (user_id, role)
            VALUES (first_user_id, 'admin');
        ELSE
            UPDATE public.user_roles SET role = 'admin' WHERE user_id = first_user_id;
        END IF;
        
        RAISE NOTICE 'Admin role created for user ID: %', first_user_id;
        RAISE NOTICE 'Total users in system: %', user_count;
        RAISE NOTICE 'User can now access admin products page at /admin/products';
    ELSE
        RAISE NOTICE 'No users found in profiles table';
        RAISE NOTICE 'Please create a user account first, then run this migration again';
    END IF;
END $$;

-- Show current admin users
DO $$
DECLARE
    admin_record RECORD;
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_roles 
    WHERE role = 'admin';
    
    RAISE NOTICE 'Total admin users: %', admin_count;
    
    FOR admin_record IN 
        SELECT ur.user_id, ur.role, p.email, p.first_name, p.last_name
        FROM public.user_roles ur
        JOIN public.profiles p ON ur.user_id = p.id
        WHERE ur.role = 'admin'
    LOOP
        RAISE NOTICE 'Admin user: % (% %)', admin_record.email, admin_record.first_name, admin_record.last_name;
    END LOOP;
END $$;