
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const OPENAI_KEY = Deno.env.get('OpenAI_API_Key');
    const MODEL = 'gpt-4o-mini';

    if (!OPENAI_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { productTitle, productImage, action } = await req.json();

    let prompt = '';
    let responseSchema = {};

    if (action === 'generate_description') {
      prompt = `You are a luxury jewelry copywriter. Based on the product title "${productTitle}", create compelling product content. Focus on craftsmanship, elegance, and personalization. Keep descriptions concise but evocative.`;
      responseSchema = {
        type: "object",
        properties: {
          title: { type: "string", description: "Refined product title" },
          description: { type: "string", description: "Compelling product description" },
          keywords: { 
            type: "array", 
            items: { type: "string" },
            description: "SEO keywords" 
          },
          meta_title: { type: "string", description: "SEO meta title" },
          meta_description: { type: "string", description: "SEO meta description" }
        },
        required: ["title", "description", "keywords", "meta_title", "meta_description"]
      };
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: `Generate content for: ${productTitle}`
          }
        ],
        functions: [{
          name: 'generate_content',
          description: 'Generate product content',
          parameters: responseSchema
        }],
        function_call: { name: 'generate_content' },
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const functionCall = data.choices[0]?.message?.function_call;
    
    if (!functionCall) {
      throw new Error('No function call in OpenAI response');
    }

    const result = JSON.parse(functionCall.arguments);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI content generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate content' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
