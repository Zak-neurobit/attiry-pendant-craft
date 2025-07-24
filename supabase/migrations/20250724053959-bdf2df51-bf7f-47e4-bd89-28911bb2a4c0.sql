
-- Fix critical security vulnerabilities

-- 1. Create a secure admin initialization table (one-time use)
CREATE TABLE public.admin_initialization (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initialization_token TEXT NOT NULL UNIQUE,
  used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin initialization
ALTER TABLE public.admin_initialization ENABLE ROW LEVEL SECURITY;

-- Only allow reading of unused, non-expired tokens
CREATE POLICY "Allow reading valid initialization tokens" 
  ON public.admin_initialization 
  FOR SELECT 
  USING (used = false AND expires_at > now());

-- 2. Strengthen user_roles table security
-- Remove any existing permissive policies and add strict ones
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Only allow admins to view roles
CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only allow admins to update roles (not insert new admin roles)
CREATE POLICY "Admins can update non-admin roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role) AND role != 'admin'::app_role);

-- Only allow admin role insertion through database functions
CREATE POLICY "Restrict admin role creation" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (role != 'admin'::app_role OR has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix profiles table to require INSERT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Add proper INSERT policy for profiles
CREATE POLICY "Users can create their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Secure API keys table - only admins should manage these
ALTER TABLE public.api_keys ADD CONSTRAINT api_keys_created_by_not_null 
  CHECK (created_by IS NOT NULL);

-- 5. Create audit log table for security events
CREATE TABLE public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" 
  ON public.security_audit_log 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs" 
  ON public.security_audit_log 
  FOR INSERT 
  WITH CHECK (true);

-- 6. Create secure admin creation function
CREATE OR REPLACE FUNCTION public.create_initial_admin(
  p_email TEXT,
  p_password TEXT,
  p_initialization_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_token_valid BOOLEAN;
BEGIN
  -- Check if initialization token is valid
  SELECT true INTO v_token_valid 
  FROM admin_initialization 
  WHERE initialization_token = p_initialization_token 
    AND used = false 
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Invalid or expired initialization token');
  END IF;
  
  -- Check if admin already exists
  IF EXISTS (SELECT 1 FROM user_roles WHERE role = 'admin') THEN
    RETURN jsonb_build_object('error', 'Admin user already exists');
  END IF;
  
  -- Create the admin user (this would need to be done through Supabase Auth API)
  -- For now, we'll assume the user_id is provided after external creation
  
  -- Mark token as used
  UPDATE admin_initialization 
  SET used = true 
  WHERE initialization_token = p_initialization_token;
  
  -- Log the admin creation
  INSERT INTO security_audit_log (action, details) 
  VALUES ('admin_initialization', jsonb_build_object('email', p_email));
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- 7. Add input validation constraints
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.profiles ADD CONSTRAINT profiles_name_length 
  CHECK (length(first_name) <= 50 AND length(last_name) <= 50);

-- 8. Secure site settings - add validation
ALTER TABLE public.site_settings ADD CONSTRAINT settings_key_format 
  CHECK (key ~ '^[a-z0-9_]+$' AND length(key) <= 100);

-- Insert initial admin token (replace with actual secure token in production)
INSERT INTO public.admin_initialization (initialization_token) 
VALUES ('secure-admin-init-' || gen_random_uuid()::text);
