
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'passed' | 'failed' | 'warning';
  message: string;
  duration?: number;
}

export const FeatureTestSuite = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const updateTest = (name: string, status: TestResult['status'], message: string, duration?: number) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.duration = duration;
        return [...prev];
      }
      return [...prev, { name, status, message, duration }];
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    const testSuite = [
      {
        name: 'Database Connection',
        test: async () => {
          const start = Date.now();
          const { error } = await supabase.from('products').select('count').limit(1);
          const duration = Date.now() - start;
          if (error) throw new Error(`Database error: ${error.message}`);
          return { message: `Connected successfully (${duration}ms)`, duration };
        }
      },
      {
        name: 'Product Loading',
        test: async () => {
          const start = Date.now();
          const { data, error } = await supabase.from('products').select('*').limit(5);
          const duration = Date.now() - start;
          if (error) throw new Error(`Product loading failed: ${error.message}`);
          return { message: `Loaded ${data?.length || 0} products (${duration}ms)`, duration };
        }
      },
      {
        name: 'Image Upload Test',
        test: async () => {
          const start = Date.now();
          // Create a test blob
          const testBlob = new Blob(['test'], { type: 'text/plain' });
          const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
          
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(`test/test-${Date.now()}.txt`, testFile);
          
          const duration = Date.now() - start;
          
          if (error) throw new Error(`Upload failed: ${error.message}`);
          
          // Clean up test file
          await supabase.storage.from('product-images').remove([data.path]);
          
          return { message: `Upload test successful (${duration}ms)`, duration };
        }
      },
      {
        name: 'AI Description Generation',
        test: async () => {
          const start = Date.now();
          try {
            const { data, error } = await supabase.functions.invoke('ai-generate-description', {
              body: { productName: 'Test Product', features: ['Premium quality', 'Elegant design'] }
            });
            const duration = Date.now() - start;
            
            if (error) throw new Error(`AI generation failed: ${error.message}`);
            if (!data || !data.description) throw new Error('No description generated');
            
            return { message: `AI description generated (${duration}ms)`, duration };
          } catch (err: any) {
            throw new Error(`AI test failed: ${err.message}`);
          }
        }
      },
      {
        name: 'Orders System',
        test: async () => {
          const start = Date.now();
          const { data, error } = await supabase.from('orders').select('count').limit(1);
          const duration = Date.now() - start;
          if (error) throw new Error(`Orders system error: ${error.message}`);
          return { message: `Orders system accessible (${duration}ms)`, duration };
        }
      },
      {
        name: 'Analytics Data',
        test: async () => {
          const start = Date.now();
          const { data, error } = await supabase.from('analytics_events').select('count').limit(1);
          const duration = Date.now() - start;
          if (error) throw new Error(`Analytics error: ${error.message}`);
          return { message: `Analytics system working (${duration}ms)`, duration };
        }
      }
    ];

    for (const test of testSuite) {
      updateTest(test.name, 'pending', 'Running...');
      
      try {
        const result = await test.test();
        updateTest(test.name, 'passed', result.message, result.duration);
      } catch (error: any) {
        updateTest(test.name, 'failed', error.message);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    const passedTests = tests.filter(t => t.status === 'passed').length;
    const totalTests = tests.length;
    
    toast({
      title: "Test Suite Complete",
      description: `${passedTests}/${totalTests} tests passed`,
      variant: passedTests === totalTests ? "default" : "destructive",
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      warning: 'secondary',
      pending: 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Card id="feature-test-suite-card">
      <CardHeader>
        <CardTitle id="test-suite-title">Website Feature Test Suite</CardTitle>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          id="run-tests-button"
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </CardHeader>
      <CardContent id="test-results-content">
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div 
              key={test.name} 
              className="flex items-center justify-between p-3 border rounded-lg"
              id={`test-result-${index}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium" id={`test-name-${index}`}>{test.name}</div>
                  <div className="text-sm text-muted-foreground" id={`test-message-${index}`}>
                    {test.message}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {test.duration && (
                  <span className="text-xs text-muted-foreground" id={`test-duration-${index}`}>
                    {test.duration}ms
                  </span>
                )}
                {getStatusBadge(test.status)}
              </div>
            </div>
          ))}
        </div>
        
        {tests.length === 0 && !isRunning && (
          <div className="text-center text-muted-foreground py-8" id="no-tests-message">
            Click "Run All Tests" to start the comprehensive feature test
          </div>
        )}
      </CardContent>
    </Card>
  );
};
