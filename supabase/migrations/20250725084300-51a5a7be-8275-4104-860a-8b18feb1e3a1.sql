
-- First, let's ensure we have the favourites column in profiles table
-- Check if the favourites column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'favourites'
    ) THEN
        ALTER TABLE profiles ADD COLUMN favourites TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;

-- Update RLS policies for profiles to allow favourites updates
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Ensure products table is properly set up for website display
-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add slug column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE products ADD COLUMN slug TEXT;
    END IF;
    
    -- Add category column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE products ADD COLUMN category TEXT;
    END IF;
END $$;

-- Create a trigger to auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
    NEW.slug = lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug = trim(both '-' from NEW.slug);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_product_slug ON products;
CREATE TRIGGER set_product_slug
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION generate_product_slug();
