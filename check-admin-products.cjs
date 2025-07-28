const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://jpbfprlpbiojfhshlhcp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminProducts() {
  console.log('=== Checking Admin Products Data ===\n');
  
  try {
    // Check if products table exists and has data
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }

    console.log(`✅ Products table accessible`);
    console.log(`📊 Total products found: ${products?.length || 0}\n`);

    if (products && products.length > 0) {
      console.log('📋 Product Summary:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title}`);
        console.log(`   - ID: ${product.id}`);
        console.log(`   - Price: $${product.price}`);
        console.log(`   - Active: ${product.is_active}`);
        console.log(`   - Featured: ${product.is_featured}`);
        console.log(`   - Stock: ${product.stock}`);
        console.log(`   - Images: ${product.image_urls?.length || 0}`);
        console.log(`   - Created: ${product.created_at}`);
        console.log('');
      });

      // Check for featured products specifically
      const featuredProducts = products.filter(p => p.is_featured);
      console.log(`⭐ Featured products: ${featuredProducts.length}`);
      featuredProducts.forEach(p => {
        console.log(`   - ${p.title} (order: ${p.featured_order})`);
      });

    } else {
      console.log('❌ No products found in database');
      console.log('This could explain why admin products page shows "Loading products"');
    }

    // Test the exact query used by admin products page
    console.log('\n=== Testing Admin Products Query ===');
    const { data: adminData, error: adminError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (adminError) {
      console.error('❌ Admin query failed:', adminError);
    } else {
      console.log(`✅ Admin query successful: ${adminData?.length || 0} products`);
    }

  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

// Run the check
checkAdminProducts().catch(console.error);