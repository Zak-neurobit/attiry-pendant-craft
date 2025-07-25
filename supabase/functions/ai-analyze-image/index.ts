
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

    // Get OpenAI API key and model from Supabase settings
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

    // Get the selected model
    const { data: modelData } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'openai_model')
      .single();

    const openAiApiKey = typeof secretData.value === 'string' ? secretData.value : (secretData.value as any).api_key;
    const selectedModel = modelData?.value ? (typeof modelData.value === 'string' ? modelData.value : (modelData.value as any).model) : 'gpt-4.1-mini';

    const { imageUrl, productContext = '', title = '', colors = [], chainTypes = [], maxTokens = 1000, temperature = 0.7 } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Image URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build comprehensive product context
    const contextParts = [];
    if (title) contextParts.push(`Product Title: ${title}`);
    if (colors.length > 0) contextParts.push(`Available Colors: ${colors.join(', ')}`);
    if (chainTypes.length > 0) contextParts.push(`Chain Types: ${chainTypes.join(', ')}`);
    if (productContext) contextParts.push(`Additional Context: ${productContext}`);
    
    const fullContext = contextParts.length > 0 ? `\n\nProduct Context:\n${contextParts.join('\n')}` : '';

    const prompt = `Analyze this jewelry product image and create compelling e-commerce content.${fullContext}

Please provide a JSON response with the following structure:
{
  "description": "A compelling 150-200 word product description that highlights luxury, craftsmanship, and emotional appeal",
  "metaTitle": "SEO-optimized meta title (50-60 characters)",
  "metaDescription": "SEO meta description (150-160 characters)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "suggestedTitle": "Improved product title if different from current",
  "targetAudience": "Primary target customer segment",
  "occasions": ["occasion1", "occasion2", "occasion3"]
}

Focus on:
- Luxury positioning and premium materials
- Personalization and customization benefits
- Emotional appeal and gift-giving occasions
- SEO optimization for jewelry search terms
- Professional e-commerce language that converts`;

    console.log(`Analyzing image with model: ${selectedModel}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are a luxury jewelry expert and e-commerce specialist. Analyze product images to create compelling product listings that highlight quality, craftsmanship, and emotional appeal. Always respond with valid JSON format only.'
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

    // Try to parse the JSON response
    let structuredResponse;
    try {
      structuredResponse = JSON.parse(analysis);
    } catch (parseError) {
      console.warn('Failed to parse JSON response, falling back to text parsing');
      // Fallback to text parsing if JSON parsing fails
      const lines = analysis.split('\n').filter(line => line.trim());
      structuredResponse = {
        description: analysis.substring(0, 500),
        metaTitle: lines.find(line => line.toLowerCase().includes('title'))?.substring(0, 60) || '',
        metaDescription: lines.find(line => line.toLowerCase().includes('description'))?.substring(0, 160) || '',
        tags: [],
        keywords: [],
        suggestedTitle: '',
        targetAudience: '',
        occasions: []
      };
    }
    
    return new Response(JSON.stringify({
      ...structuredResponse,
      rawAnalysis: analysis,
      model: selectedModel
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
