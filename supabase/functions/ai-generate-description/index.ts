
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

    const { productName, features = [], model = 'gpt-4.1-mini', maxTokens = 1000, temperature = 0.7 } = await req.json();

    const featuresText = features.length > 0 ? `\nKey features: ${features.join(', ')}` : '';
    
    const prompt = `Write a compelling product description for "${productName}".${featuresText}

The description should be:
- Engaging and persuasive
- Highlight the luxury and premium quality
- Appeal to customers looking for personalized jewelry
- Be around 100-150 words
- Focus on craftsmanship and emotional value`;

    console.log('Generating description with model:', model);

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
            content: 'You are a luxury jewelry copywriter specializing in personalized products. Write compelling, emotional product descriptions that highlight craftsmanship and personal connection.'
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
    const description = data.choices[0]?.message?.content?.trim();

    if (!description) {
      throw new Error('No description generated');
    }

    console.log('Generated description successfully');

    return new Response(JSON.stringify({ 
      description,
      model: 'gpt-4.1-mini' // Always return gpt-4.1-mini
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-generate-description:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate description',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
