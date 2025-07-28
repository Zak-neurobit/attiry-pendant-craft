const { createClient } = require('@supabase/supabase-js');
const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://jpbfprlpbiojfhshlhcp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Image folder path
const imageFolderPath = 'C:\\Users\\Hafsa\\Desktop\\Attiry\\Name pendant images';

// Product mapping with their expected variants and proper order
const productMapping = {
  'Aria': ['Gold', 'Silver', 'Rose Gold', 'Black', 'Worn'],
  'Ariana': ['Gold', 'Silver', 'Rose Gold', 'Black', 'Worn'],
  'Habibi Arabic': ['Gold', 'Silver', 'Rose Gold', 'Black', 'Worn'],
  'Isabella': ['Gold', 'Silver', 'Rose Gold', 'Black', 'Worn'],
  'Layla': ['Gold', 'Silver', 'Black', 'Worn'], // Missing Rose Gold
  'Milaa': ['Gold', 'Silver', 'Rose Gold', 'Black'], // Missing Worn
  'Olivia': ['Gold', 'Silver', 'Rose Gold', 'Black', 'Worn'],
  'Sophia': ['Gold', 'Silver', 'Rose Gold', 'Black', 'Worn'],
  'Yasmeen Arabic': ['Gold', 'Silver', 'Rose Gold', 'Black', 'Worn'],
  'Zara': ['Gold', 'Silver', 'Rose Gold', 'Black', 'Worn']
};

// Slug mapping for database updates
const slugMapping = {
  'Aria': 'aria-name-pendant',
  'Ariana': 'ariana-name-pendant', 
  'Habibi Arabic': 'habibi-arabic-name-pendant',
  'Isabella': 'isabella-name-pendant',
  'Layla': 'layla-name-pendant',
  'Milaa': 'milaa-name-pendant',
  'Olivia': 'olivia-name-pendant',
  'Sophia': 'sophia-name-pendant',
  'Yasmeen Arabic': 'yasmeen-arabic-name-pendant',
  'Zara': 'zara-name-pendant'
};

// Function to upload image to Supabase storage
async function uploadImage(filePath, fileName) {
  try {
    const fileData = readFileSync(filePath);
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, fileData, {
        contentType: fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${fileName}:`, error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error);
    return null;
  }
}

// Function to normalize variant name for comparison
function normalizeVariantName(variant) {
  return variant.toLowerCase()
    .replace(/\s+/g, '-')
    .replace('rose-gold', 'rose-gold')
    .replace('arabic', '');
}

// Function to upload all product images
async function uploadAllImages() {
  console.log('Starting image upload process...');
  
  try {
    const files = readdirSync(imageFolderPath);
    const uploadedImages = {};

    // Initialize all products
    for (const productName of Object.keys(productMapping)) {
      uploadedImages[productName] = [];
    }

    for (const file of files) {
      // Skip non-image files
      if (!file.match(/\.(jpeg|jpg|png)$/i)) {
        console.log(`Skipping non-image file: ${file}`);
        continue;
      }

      // Parse filename to extract product name and variant
      let productName = '';
      let variant = '';
      
      // Try to match product names (check longer names first)
      const sortedProducts = Object.keys(productMapping).sort((a, b) => b.length - a.length);
      for (const product of sortedProducts) {
        if (file.startsWith(product)) {
          productName = product;
          variant = file.replace(product, '').replace(/\.(jpeg|jpg|png)$/i, '').trim();
          break;
        }
      }

      if (!productName) {
        console.log(`Skipping unrecognized file: ${file}`);
        continue;
      }

      // Clean variant name
      variant = variant.replace(/^[\s\-]+/, '').replace(/[\s\-]+$/, '');
      
      const filePath = join(imageFolderPath, file);
      const normalizedProductName = productName.toLowerCase().replace(/\s+/g, '-');
      const normalizedVariant = normalizeVariantName(variant);
      const storageName = `${normalizedProductName}-${normalizedVariant}.${file.split('.').pop()}`;
      
      console.log(`Uploading: ${file} -> ${storageName}`);
      
      const publicUrl = await uploadImage(filePath, storageName);
      
      if (publicUrl) {
        uploadedImages[productName].push({
          variant: variant,
          url: publicUrl,
          originalFile: file
        });
        console.log(`✓ Uploaded: ${storageName}`);
      } else {
        console.log(`✗ Failed: ${storageName}`);
      }
    }

    // Sort images by the expected variant order for each product
    for (const productName of Object.keys(uploadedImages)) {
      const expectedOrder = productMapping[productName];
      uploadedImages[productName].sort((a, b) => {
        const aIndex = expectedOrder.findIndex(v => v.toLowerCase() === a.variant.toLowerCase());
        const bIndex = expectedOrder.findIndex(v => v.toLowerCase() === b.variant.toLowerCase());
        return aIndex - bIndex;
      });
    }

    return uploadedImages;
  } catch (error) {
    console.error('Error during upload process:', error);
    return {};
  }
}

// Function to update database with image URLs
async function updateProductImages(uploadedImages) {
  console.log('\nUpdating database with image URLs...');

  for (const [productName, images] of Object.entries(uploadedImages)) {
    if (images.length === 0) {
      console.log(`⚠ No images found for ${productName}, skipping...`);
      continue;
    }

    const imageUrls = images.map(img => img.url);
    const slug = slugMapping[productName];
    
    if (!slug) {
      console.error(`No slug mapping found for ${productName}`);
      continue;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ image_urls: imageUrls })
        .eq('slug', slug);

      if (error) {
        console.error(`Error updating ${productName}:`, error);
      } else {
        console.log(`✓ Updated ${productName} (${slug}) with ${imageUrls.length} images`);
        console.log(`  Variants: ${images.map(img => img.variant).join(', ')}`);
      }
    } catch (error) {
      console.error(`Failed to update ${productName}:`, error);
    }
  }
}

// Main execution
async function main() {
  console.log('=== Pendant Image Upload Script ===\n');
  
  const uploadedImages = await uploadAllImages();
  
  if (Object.keys(uploadedImages).length > 0) {
    console.log('\n=== Upload Summary ===');
    for (const [product, images] of Object.entries(uploadedImages)) {
      console.log(`${product}: ${images.length} images`);
    }
    
    await updateProductImages(uploadedImages);
    console.log('\n✓ Image upload and database update completed!');
  } else {
    console.log('\n✗ No images were uploaded successfully.');
  }
}

// Run the script
main().catch(console.error);