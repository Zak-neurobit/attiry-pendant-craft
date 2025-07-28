const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://jpbfprlpbiojfhshlhcp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Product mapping for organizing images
const productMapping = {
  'aria': ['gold', 'silver', 'rose-gold', 'black', 'worn'],
  'ariana': ['gold', 'silver', 'rose-gold', 'black', 'worn'],
  'habibi-arabic': ['gold', 'silver', 'rose-gold', 'black', 'worn'],
  'isabella': ['gold', 'silver', 'rose-gold', 'black', 'worn'],
  'layla': ['gold', 'silver', 'black', 'worn'],
  'milaa': ['gold', 'silver', 'rose-gold', 'black'],
  'olivia': ['gold', 'silver', 'rose-gold', 'black', 'worn'],
  'sophia': ['gold', 'silver', 'rose-gold', 'black', 'worn'],
  'yasmeen-arabic': ['gold', 'silver', 'rose-gold', 'black', 'worn'],
  'zara': ['gold', 'silver', 'rose-gold', 'black', 'worn']
};

async function checkStorageImages() {
  console.log('=== Checking Supabase Storage Images ===\n');
  
  try {
    // List all files in the product-images bucket
    const { data: files, error } = await supabase.storage
      .from('product-images')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error listing files:', error);
      return;
    }

    console.log(`Found ${files?.length || 0} files in storage:\n`);

    const imagesByProduct = {};

    // Organize images by product
    for (const file of files || []) {
      console.log(`File: ${file.name}`);
      
      // Get public URL for each file
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(file.name);
      
      console.log(`URL: ${publicUrl}`);
      
      // Organize by product name
      for (const productName of Object.keys(productMapping)) {
        if (file.name.startsWith(productName)) {
          if (!imagesByProduct[productName]) {
            imagesByProduct[productName] = [];
          }
          imagesByProduct[productName].push({
            filename: file.name,
            url: publicUrl
          });
          break;
        }
      }
      console.log('---');
    }

    console.log('\n=== Images Organized by Product ===\n');
    
    for (const [productName, images] of Object.entries(imagesByProduct)) {
      console.log(`${productName.toUpperCase()}: ${images.length} images`);
      images.forEach(img => console.log(`  - ${img.filename}`));
      console.log('');
    }

    console.log('\n=== Testing Image Accessibility ===\n');
    
    // Test if images are actually accessible
    for (const [productName, images] of Object.entries(imagesByProduct)) {
      if (images.length > 0) {
        const testImage = images[0];
        console.log(`Testing: ${testImage.url}`);
        
        try {
          const response = await fetch(testImage.url, { method: 'HEAD' });
          console.log(`Status: ${response.status} ${response.statusText}`);
        } catch (err) {
          console.log(`Error: ${err.message}`);
        }
        console.log('---');
      }
    }

    return imagesByProduct;

  } catch (error) {
    console.error('Error during storage check:', error);
  }
}

// Run the check
checkStorageImages().catch(console.error);