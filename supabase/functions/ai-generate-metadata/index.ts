
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
    const { productTitle, description, category } = await req.json();

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

    const prompt = `Generate SEO-optimized metadata for this jewelry product:

Product Title: ${productTitle}
Description: ${description}
Category: ${category || 'jewelry'}

Please create:
1. A meta title (50-60 characters) that includes the main keyword and is compelling
2. A meta description (150-160 characters) that encourages clicks and includes relevant keywords
3. 5-8 relevant tags/keywords for the product

Return the response as JSON with keys: metaTitle, metaDescription, tags`;

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
            content: "You are an SEO expert specializing in e-commerce product optimization. Create metadata that improves search rankings and click-through rates."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.5
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate metadata");
    }

    const data = await response.json();
    const metadata = JSON.parse(data.choices[0].message.content);

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
      JSON.stringify(metadata),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Metadata generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
