
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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get OpenAI API key from site_settings
    const { data: secretData, error: secretError } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'openai_api_key')
      .single();

    if (secretError || !secretData?.value) {
      throw new Error('OpenAI API key not configured in site_settings');
    }

    // Get the selected model
    const { data: modelData } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'openai_model')
      .single();

    const openAiApiKey = typeof secretData.value === 'string' ? secretData.value : (secretData.value as any).api_key;
    const selectedModel = modelData?.value ? (typeof modelData.value === 'string' ? modelData.value : (modelData.value as any).model) : 'gpt-4.1-mini';

    if (!openAiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        model: selectedModel,
        keyStatus: 'configured',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("AI ping error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        keyStatus: 'missing'
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
