
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get OpenAI API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabaseAdmin
      .from('site_settings')  
      .select('value')
      .eq('key', 'openai_api_key')
      .single();

    if (secretError || !secretData?.value) {
      console.error('OpenAI API key not found in site_settings');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAiApiKey = typeof secretData.value === 'string' ? secretData.value : (secretData.value as any).key;

    const { imageUrl, productContext = '', model = 'gpt-4.1-mini', maxTokens = 1000, temperature = 0.7 } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Image URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analyze this jewelry product image and provide detailed information for an e-commerce listing.${productContext ? ` Context: ${productContext}` : ''}

Please provide:
1. A detailed product description (100-150 words)
2. Key features and materials visible
3. Style and design elements
4. Suggested product title
5. Target audience/occasion
6. SEO-friendly keywords

Focus on luxury, craftsmanship, and personalization aspects.`;

    console.log('Analyzing image with model: gpt-4.1-mini');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini', // Force gpt-4.1-mini
        messages: [
          {
            role: 'system',
            content: 'You are a luxury jewelry expert and e-commerce specialist. Analyze product images to create compelling product listings that highlight quality, craftsmanship, and emotional appeal.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI vision API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content?.trim();

    if (!analysis) {
      throw new Error('No analysis generated');
    }

    console.log('Image analysis completed successfully');

    // Try to structure the response
    const lines = analysis.split('\n').filter(line => line.trim());
    
    return new Response(JSON.stringify({
      analysis,
      structured: {
        fullAnalysis: analysis,
        summary: lines.slice(0, 3).join(' ').substring(0, 200) + '...'
      },
      model: 'gpt-4.1-mini' // Always return gpt-4.1-mini
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-analyze-image:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze image',
      details: error.message 
    }), {
      status: 500,  
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
