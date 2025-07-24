
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const model = 'gpt-4.1-mini';

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured in Supabase Secrets');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        model,
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
