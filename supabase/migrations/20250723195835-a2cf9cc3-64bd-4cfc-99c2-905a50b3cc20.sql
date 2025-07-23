-- Create admin user with the provided credentials
-- First, let's insert a sample user profile and role
-- Note: In a real scenario, the user would sign up through the UI and we'd add the admin role

-- Insert sample products for the pendant designs
INSERT INTO public.products (title, description, price, stock, sku, image_urls, color_variants, keywords, is_active) VALUES
-- Classic Script Design
('Classic Script Name Pendant', 'Elegant script pendant with your personalized name, handcrafted with premium finishes', 4000, 50, 'PENDANT-CLASSIC-SCRIPT', 
 ARRAY[
   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop'
 ], 
 ARRAY['gold', 'matte_gold', 'rose_gold', 'silver', 'matte_silver', 'vintage_copper', 'black']::color_variant[], 
 ARRAY['classic', 'script', 'elegant', 'personalized', 'name', 'pendant'], true),

-- Minimal Sans Design
('Minimal Sans Name Pendant', 'Clean and modern sans-serif pendant design, perfect for contemporary style', 4000, 50, 'PENDANT-MINIMAL-SANS',
 ARRAY[
   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop'
 ],
 ARRAY['gold', 'matte_gold', 'rose_gold', 'silver', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
 ARRAY['minimal', 'modern', 'sans', 'clean', 'contemporary', 'pendant'], true),

-- Elegant Serif Design
('Elegant Serif Name Pendant', 'Sophisticated serif typography pendant with timeless appeal and luxury finish', 4000, 50, 'PENDANT-ELEGANT-SERIF',
 ARRAY[
   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop'
 ],
 ARRAY['gold', 'matte_gold', 'rose_gold', 'silver', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
 ARRAY['elegant', 'serif', 'sophisticated', 'luxury', 'timeless', 'pendant'], true),

-- Bold Gothic Design
('Bold Gothic Name Pendant', 'Strong gothic lettering pendant design for those who prefer bold statement pieces', 4000, 50, 'PENDANT-BOLD-GOTHIC',
 ARRAY[
   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop'
 ],
 ARRAY['gold', 'matte_gold', 'rose_gold', 'silver', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
 ARRAY['bold', 'gothic', 'strong', 'statement', 'dramatic', 'pendant'], true),

-- Handwritten Chic Design
('Handwritten Chic Name Pendant', 'Beautiful handwritten style pendant with organic curves and artistic flair', 4000, 50, 'PENDANT-HANDWRITTEN-CHIC',
 ARRAY[
   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop',
   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop'
 ],
 ARRAY['gold', 'matte_gold', 'rose_gold', 'silver', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
 ARRAY['handwritten', 'chic', 'organic', 'artistic', 'beautiful', 'pendant'], true);