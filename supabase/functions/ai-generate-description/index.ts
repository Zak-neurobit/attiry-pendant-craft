
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentDescription, productTitle, productType } = await req.json();

    // Get OpenAI API key from settings
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: settingsData, error: settingsError } = await supabaseClient
      .from('site_settings')
      .select('value')
      .eq('key', 'openai_api_key')
      .single();

    if (settingsError || !settingsData) {
      throw new Error("OpenAI API key not configured");
    }

    const apiKey = settingsData.value.api_key;

    const prompt = `Enhance this jewelry product description to be more engaging and professional:

Product Title: ${productTitle}
Product Type: ${productType || 'jewelry'}
Current Description: ${currentDescription || 'No description provided'}

Please create an enhanced, marketing-focused description that:
- Highlights the craftsmanship and quality
- Appeals to emotions and lifestyle
- Includes relevant keywords for SEO
- Maintains a luxury brand tone
- Is 2-3 paragraphs long

Return only the enhanced description text.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter specializing in luxury jewelry marketing. Create compelling product descriptions that convert browsers into buyers."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate description");
    }

    const data = await response.json();
    const enhancedDescription = data.choices[0].message.content.trim();

    // Update usage stats
    await supabaseClient
      .from('site_settings')
      .upsert({
        key: 'ai_usage_stats',
        value: {
          totalCalls: 1,
          lastCall: new Date().toISOString(),
          estimatedCost: 0.01
        }
      });

    return new Response(
      JSON.stringify({ description: enhancedDescription }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Description generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
