
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const defaultModel = 'gpt-4.1-mini';

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, model } = await req.json();

    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured in Supabase Secrets");
    }

    const selectedModel = model || defaultModel;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this jewelry product image. Provide a detailed description, identify the dominant colors, suggest product tags, and estimate the style/category. Return the response as JSON with keys: description, colors, tags, category, style."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to analyze image");
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Try to parse as JSON, fallback to text
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch {
      parsedAnalysis = {
        description: analysis,
        colors: [],
        tags: [],
        category: "jewelry",
        style: "modern"
      };
    }

    // Update usage stats
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

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
      JSON.stringify(parsedAnalysis),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Image analysis error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
