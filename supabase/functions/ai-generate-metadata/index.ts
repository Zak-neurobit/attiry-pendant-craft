
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

    const { productName, description, model = 'gpt-4.1-mini', maxTokens = 500, temperature = 0.3 } = await req.json();

    const prompt = `Based on this product information, generate SEO metadata:

Product: ${productName}
Description: ${description}

Generate:
1. A compelling SEO title (max 60 characters)
2. A meta description (max 160 characters) 
3. 5-7 relevant keywords for search optimization

Focus on jewelry, personalization, luxury, and gift-giving themes.

Return the response in this exact JSON format:
{
  "title": "SEO title here",
  "description": "Meta description here", 
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    console.log('Generating metadata with model:', selectedModel);

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
            content: 'You are an SEO expert specializing in e-commerce and luxury jewelry. Generate optimized metadata that will help products rank well in search engines.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('No metadata generated');
    }

    // Try to parse as JSON
    let metadata;
    try {
      metadata = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content);
      // Fallback parsing if JSON is malformed
      const titleMatch = content.match(/"title":\s*"([^"]+)"/);
      const descMatch = content.match(/"description":\s*"([^"]+)"/);
      const keywordsMatch = content.match(/"keywords":\s*\[(.*?)\]/);
      
      metadata = {
        title: titleMatch ? titleMatch[1] : `${productName} - Premium Personalized Jewelry`,
        description: descMatch ? descMatch[1] : `Discover our ${productName} - handcrafted personalized jewelry perfect for special occasions.`,
        keywords: keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim().replace(/"/g, '')) : ['personalized jewelry', 'custom pendant', 'luxury gifts']
      };
    }

    console.log('Generated metadata successfully');

    return new Response(JSON.stringify({
      ...metadata,
      model: selectedModel
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-generate-metadata:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate metadata',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
