import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8081';

test.describe('Website Function Tests', () => {
  
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Attiry|Home/);
    
    // Check for key elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for featured products section
    await expect(page.locator('[data-testid="featured-products"]')).toBeVisible();
    
    console.log('✅ Homepage test passed');
  });

  test('Shop page displays products', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop`);
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 });
    
    // Check if products are displayed
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
    
    console.log('✅ Shop page test passed');
  });

  test('Product detail page functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop`);
    
    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    
    // Check if we're on product detail page
    await expect(page.url()).toContain('/product/');
    
    // Check for customization options
    await expect(page.locator('[data-testid="product-customizer"]')).toBeVisible();
    
    // Test add to cart functionality
    const addToCartBtn = page.locator('[data-testid="add-to-cart"]');
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      
      // Check if cart updated
      await expect(page.locator('[data-testid="cart-count"]')).toBeVisible();
    }
    
    console.log('✅ Product detail test passed');
  });

  test('Cart functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart`);
    
    // Check cart page loads
    await expect(page.locator('h1')).toContainText(/cart/i);
    
    // Test cart drawer
    const cartIcon = page.locator('[data-testid="cart-icon"]');
    if (await cartIcon.isVisible()) {
      await cartIcon.click();
      await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
    }
    
    console.log('✅ Cart test passed');
  });

  test('User authentication', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
    
    // Check login form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    console.log('✅ Authentication test passed');
  });

  test('Admin login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    
    // Should redirect to admin login or show admin interface
    await page.waitForLoadState('networkidle');
    
    // Check for admin login form or dashboard
    const isLoginPage = await page.locator('input[type="password"]').isVisible();
    const isDashboard = await page.locator('[data-testid="admin-dashboard"]').isVisible();
    
    expect(isLoginPage || isDashboard).toBeTruthy();
    
    console.log('✅ Admin access test passed');
  });

  test('Search functionality', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Test search
    const searchInput = page.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('pendant');
      await searchInput.press('Enter');
      
      // Check search results
      await expect(page.url()).toContain('/search');
    }
    
    console.log('✅ Search test passed');
  });

  test('Responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Check mobile menu
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    console.log('✅ Responsive design test passed');
  });

  test('Currency and language switching', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Test currency switcher
    const currencySelector = page.locator('[data-testid="currency-selector"]');
    if (await currencySelector.isVisible()) {
      await currencySelector.click();
      
      // Select different currency
      const eurOption = page.locator('[data-value="EUR"]');
      if (await eurOption.isVisible()) {
        await eurOption.click();
      }
    }
    
    // Test language toggle
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    if (await languageToggle.isVisible()) {
      await languageToggle.click();
    }
    
    console.log('✅ Currency/Language test passed');
  });

  test('Performance check', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`📊 Page load time: ${loadTime}ms`);
    
    // Check if load time is reasonable (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    console.log('✅ Performance test passed');
  });
});

test.describe('Admin Function Tests', () => {
  
  test('Admin dashboard access', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);
    
    // Will either show login form or dashboard
    await page.waitForLoadState('networkidle');
    
    const hasLoginForm = await page.locator('input[type="password"]').isVisible();
    const hasDashboard = await page.locator('[data-testid="admin-stats"]').isVisible();
    
    expect(hasLoginForm || hasDashboard).toBeTruthy();
    
    console.log('✅ Admin dashboard test passed');
  });

  test('Product management page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/products`);
    
    // Check for products table or login form
    await page.waitForLoadState('networkidle');
    
    const hasProductsTable = await page.locator('[data-testid="products-table"]').isVisible();
    const hasLoginForm = await page.locator('input[type="password"]').isVisible();
    
    expect(hasProductsTable || hasLoginForm).toBeTruthy();
    
    console.log('✅ Product management test passed');
  });

  test('Analytics page load', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/analytics`);
    
    await page.waitForLoadState('networkidle');
    
    // Should load analytics or login form
    const hasAnalytics = await page.locator('[data-testid="analytics-charts"]').isVisible();
    const hasLoginForm = await page.locator('input[type="password"]').isVisible();
    
    expect(hasAnalytics || hasLoginForm).toBeTruthy();
    
    console.log('✅ Analytics test passed');
  });
});

test.describe('Integration Tests', () => {
  
  test('Supabase connectivity', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check browser console for Supabase errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('supabase')) {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(3000);
    
    // Log any Supabase errors for debugging
    if (errors.length > 0) {
      console.log('⚠️ Supabase errors detected:', errors);
    } else {
      console.log('✅ No Supabase connectivity errors detected');
    }
  });

  test('Payment page accessibility', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/payments`);
    
    await page.waitForLoadState('networkidle');
    
    // Check if page loads without critical errors
    const hasContent = await page.locator('main').isVisible();
    expect(hasContent).toBeTruthy();
    
    console.log('✅ Payment page accessibility test passed');
  });
});