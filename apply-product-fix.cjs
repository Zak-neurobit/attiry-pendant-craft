const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jpbfprlpbiojfhshlhcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testProductAccess() {
  try {
    console.log('🔍 Testing product access...\n');

    // Test 1: Can we access products table?
    console.log('📋 Testing products table access:');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price, is_active, is_featured')
      .eq('is_active', true)
      .limit(5);

    if (productsError) {
      console.log('❌ Products query failed:', productsError.message);
      console.log('   Error details:', productsError);
    } else {
      console.log(`✅ Successfully fetched ${products?.length || 0} products`);
      if (products && products.length > 0) {
        console.log('   Sample products:');
        products.forEach(p => {
          console.log(`   - ${p.title} ($${p.price}) - Featured: ${p.is_featured ? 'Yes' : 'No'}`);
        });
      } else {
        console.log('   ⚠️  No products found (but query succeeded)');
      }
    }

    // Test 2: Check featured products specifically
    console.log('\n🌟 Testing featured products:');
    const { data: featuredProducts, error: featuredError } = await supabase
      .from('products')
      .select('id, title, price, is_featured')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(10);

    if (featuredError) {
      console.log('❌ Featured products query failed:', featuredError.message);
    } else {
      console.log(`✅ Successfully fetched ${featuredProducts?.length || 0} featured products`);
      if (featuredProducts && featuredProducts.length > 0) {
        featuredProducts.forEach(p => {
          console.log(`   - ${p.title} ($${p.price})`);
        });
      } else {
        console.log('   ⚠️  No featured products found');
      }
    }

    // Test 3: Test the exact same query as the frontend
    console.log('\n🎯 Testing frontend query (getFeaturedProductsWithFallback):');
    const { data: frontendData, error: frontendError } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('featured_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(4);

    if (frontendError) {
      console.log('❌ Frontend query failed:', frontendError.message);
      console.log('   This is the exact error the homepage is seeing!');
    } else {
      console.log(`✅ Frontend query successful: ${frontendData?.length || 0} products`);
      if (frontendData && frontendData.length > 0) {
        frontendData.forEach(p => {
          console.log(`   - ${p.title} (Order: ${p.featured_order})`);
        });
      }
    }

    // Test 4: Fallback query (newest products)
    console.log('\n🔄 Testing fallback query (newest products):');
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4);

    if (fallbackError) {
      console.log('❌ Fallback query failed:', fallbackError.message);
    } else {
      console.log(`✅ Fallback query successful: ${fallbackData?.length || 0} products`);
    }

    console.log('\n🎯 Diagnosis:');
    if (!productsError && products && products.length > 0) {
      console.log('✅ Database access is working');
      console.log('✅ Products exist in database');
      if (featuredProducts && featuredProducts.length > 0) {
        console.log('✅ Featured products are properly configured');
        console.log('🔍 Issue might be in frontend error handling or loading states');
      } else {
        console.log('⚠️  No featured products found - need to set some products as featured');
      }
    } else {
      console.log('❌ Database access is blocked - RLS policies need to be updated');
    }

  } catch (error) {
    console.error('Error testing product access:', error);
  }
}

// Run the test
if (require.main === module) {
  testProductAccess();
}

module.exports = { testProductAccess };