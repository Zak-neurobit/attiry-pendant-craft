import { useState, useEffect } from 'react';
import { ChevronRight, Star, Quote, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SimpleProductCard } from '@/components/SimpleProductCard';
import { CurrencyIndicator } from '@/components/CurrencyIndicator';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-pendant.jpg';
import collectionImage from '@/assets/collection-hero.jpg';
import productGold from '@/assets/product-gold.jpg';
import productRoseGold from '@/assets/product-rose-gold.jpg';

const HomeDebug = () => {
  const [scrollY, setScrollY] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('testing');

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testSupabaseConnection = async () => {
    addDebugLog('🔍 Starting comprehensive connection test...');
    
    try {
      // Test 0: Browser environment check
      addDebugLog('🌐 Checking browser environment...');
      addDebugLog(`🌐 Navigator online: ${navigator.onLine}`);
      addDebugLog(`🌐 User agent: ${navigator.userAgent.substring(0, 50)}...`);
      addDebugLog(`🌐 Location: ${window.location.href}`);
      
      // Test 1: Check Supabase client initialization
      addDebugLog(`🔧 Supabase client URL: ${supabase.supabaseUrl}`);
      addDebugLog(`🔧 Supabase client key: ${supabase.supabaseKey.substring(0, 20)}...`);
      addDebugLog(`🔧 Auth available: ${!!supabase.auth}`);
      addDebugLog(`🔧 From available: ${!!supabase.from}`);

      // Test 2: Try direct HTTP fetch first
      addDebugLog('🌐 Testing direct HTTP fetch...');
      try {
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/products?select=id&limit=1`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          }
        });
        
        if (response.ok) {
          addDebugLog('✅ Direct HTTP fetch successful');
          addDebugLog('🔄 HTTP works, trying Supabase client with shorter timeout...');
        } else {
          addDebugLog(`❌ Direct HTTP failed: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          addDebugLog(`❌ HTTP Error body: ${errorText}`);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (httpError) {
        addDebugLog(`❌ HTTP fetch failed: ${httpError}`);
        throw new Error(`Network connectivity issue: ${httpError}`);
      }

      // Test 3: Supabase client with shorter timeout (5s)
      addDebugLog('📞 Testing Supabase client (5s timeout)...');
      
      const connectionPromise = supabase
        .from('products')
        .select('id')
        .limit(1);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Supabase client timeout after 5 seconds')), 5000);
      });
      
      let result;
      try {
        result = await Promise.race([
          connectionPromise,
          timeoutPromise
        ]);
        addDebugLog('✅ Supabase client works!');
      } catch (clientError) {
        addDebugLog(`❌ Supabase client failed: ${clientError}`);
        addDebugLog('🔄 Falling back to direct HTTP for data...');
        
        // Fallback to HTTP for actual data
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/products?select=*&is_featured=eq.true&is_active=eq.true&order=featured_order.asc&limit=4`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP fallback failed: ${response.status}`);
        }
        
        const featuredData = await response.json();
        addDebugLog(`✅ HTTP fallback successful: ${featuredData?.length || 0} products`);
        
        if (featuredData && featuredData.length > 0) {
          const convertedProducts = featuredData.map(product => ({
            id: product.id,
            slug: product.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || 'product',
            name: product.title || 'Unnamed Product',
            price: Number(product.price) || 0,
            originalPrice: product.compare_price && Number(product.compare_price) > Number(product.price) 
              ? Number(product.compare_price) 
              : undefined,
            description: product.description || 'Beautiful custom name pendant',
            images: product.image_urls && product.image_urls.length > 0 
              ? product.image_urls 
              : [productGold],
            rating: 5,
            reviewCount: 150,
            isNew: product.created_at ? new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
            colors: product.color_variants || ['gold'],
            category: 'custom-pendants',
            stock: product.stock || 10,
            sku: product.sku
          }));

          setProducts(convertedProducts);
          setConnectionStatus('http-fallback');
          addDebugLog(`✅ Using HTTP fallback: ${convertedProducts.length} products`);
          return true;
        }
      }

      const { data: testData, error: testError } = result as any;

      if (testError) {
        addDebugLog(`❌ Supabase connection failed: ${testError.message}`);
        addDebugLog(`❌ Error code: ${testError.code}`);
        addDebugLog(`❌ Error details: ${testError.details}`);
        addDebugLog(`❌ Error hint: ${testError.hint}`);
        setConnectionStatus('failed');
        return false;
      }

      addDebugLog(`✅ Supabase client successful, got ${testData?.length || 0} items`);

      // Test 3: Featured products query
      addDebugLog('📞 Testing featured products query...');
      const { data: featuredData, error: featuredError } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('featured_order', { ascending: true })
        .limit(4);

      if (featuredError) {
        addDebugLog(`❌ Featured query failed: ${featuredError.message}`);
        setConnectionStatus('partial');
        return false;
      }

      addDebugLog(`✅ Featured products query successful: ${featuredData?.length || 0} products`);
      
      if (featuredData && featuredData.length > 0) {
        // Convert products
        const convertedProducts = featuredData.map(product => ({
          id: product.id,
          slug: product.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || 'product',
          name: product.title || 'Unnamed Product',
          price: Number(product.price) || 0,
          originalPrice: product.compare_price && Number(product.compare_price) > Number(product.price) 
            ? Number(product.compare_price) 
            : undefined,
          description: product.description || 'Beautiful custom name pendant',
          images: product.image_urls && product.image_urls.length > 0 
            ? product.image_urls 
            : [productGold],
          rating: 5,
          reviewCount: 150,
          isNew: product.created_at ? new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
          colors: product.color_variants || ['gold'],
          category: 'custom-pendants',
          stock: product.stock || 10,
          sku: product.sku
        }));

        setProducts(convertedProducts);
        setConnectionStatus('success');
        addDebugLog(`✅ Products converted and set: ${convertedProducts.length}`);
        return true;
      } else {
        addDebugLog('⚠️ No featured products found in database');
        setConnectionStatus('no-data');
        return false;
      }

    } catch (error) {
      addDebugLog(`❌ Connection test failed with exception: ${error}`);
      addDebugLog(`❌ Error type: ${typeof error}`);
      addDebugLog(`❌ Error name: ${(error as Error)?.name}`);
      addDebugLog(`❌ Error message: ${(error as Error)?.message}`);
      addDebugLog(`❌ Error stack: ${(error as Error)?.stack}`);
      setConnectionStatus('error');
      return false;
    }
  };

  useEffect(() => {
    const runTest = async () => {
      addDebugLog('🚀 Component mounted, starting connection test...');
      const success = await testSupabaseConnection();
      
      if (!success) {
        addDebugLog('🔄 Connection failed, using fallback products...');
        // Set fallback products
        const fallbackProducts = [
          {
            id: 'fallback-1',
            slug: 'aria-name-pendant',
            name: 'Aria Name Pendant (Fallback)',
            price: 299.99,
            originalPrice: 399.99,
            description: 'Fallback product - database connection failed',
            images: [productGold],
            rating: 5,
            reviewCount: 150,
            isNew: false,
            colors: ['gold', 'silver', 'rose-gold'],
            category: 'custom-pendants',
            stock: 50,
            sku: 'ARI-001'
          }
        ];
        setProducts(fallbackProducts);
      }
      
      setIsLoading(false);
      addDebugLog('🏁 Test complete');
    };

    runTest();
  }, []);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Absolutely stunning quality! My custom pendant exceeded all expectations.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=64&h=64&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img 
            src={heroImage} 
            alt="Luxury Custom Name Pendant - Personalized Jewelry"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-background/20" />
        </div>

        <div className="absolute top-6 left-6 z-20">
          <CurrencyIndicator variant="compact" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="fade-in">
              <h1 className="text-5xl md:text-7xl font-cormorant font-bold text-foreground mb-6 leading-tight">
                Custom Name
                <span className="block text-accent">Pendants</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Handcrafted jewelry that tells your story. Personalize your style with our premium custom name pendants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-cta text-lg px-8 py-4">
                  <Link to="/shop">
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-outline-luxury text-lg px-8 py-4">
                  <Link to="/about">
                    Explore Collection
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Debug Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">🔍 Database Connection Debug</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Connection Status:</h4>
                <div className={`p-3 rounded ${
                  connectionStatus === 'success' ? 'bg-green-100 text-green-800' :
                  connectionStatus === 'http-fallback' ? 'bg-blue-100 text-blue-800' :
                  connectionStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  connectionStatus === 'testing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {connectionStatus === 'success' && '✅ Supabase client working'}
                  {connectionStatus === 'http-fallback' && '🔄 Using HTTP fallback'}
                  {connectionStatus === 'failed' && '❌ Connection failed'}
                  {connectionStatus === 'testing' && '🔄 Testing connection...'}
                  {connectionStatus === 'error' && '💥 Connection error'}
                  {connectionStatus === 'partial' && '⚠️ Partial connection'}
                  {connectionStatus === 'no-data' && '📭 No data found'}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Products Found:</h4>
                <div className="p-3 bg-gray-100 rounded">
                  {products.length} products loaded
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Debug Log:</h4>
              <div className="bg-black text-green-400 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
                {debugInfo.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-source-serif font-bold text-foreground mb-4">
                Top Offers
              </h2>
              <p className="text-muted-foreground">
                Debug Mode - Connection Status: {connectionStatus}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Testing database connection...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <div 
                  key={product.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <SimpleProductCard product={product} priority={index < 2} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-red-600">No products found</p>
                <p className="text-sm text-gray-600">Check debug log above for details</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => {
                setIsLoading(true);
                setDebugInfo([]);
                testSupabaseConnection().then(() => setIsLoading(false));
              }}
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Test Connection Again
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeDebug;