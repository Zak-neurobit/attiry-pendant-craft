
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const isRateLimited = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return false;
  }
  
  if (userLimit.count >= 5) { // Max 5 requests per minute
    return true;
  }
  
  userLimit.count++;
  return false;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client using service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Enhanced authentication verification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth verification failed:', authError);
      throw new Error('Invalid authentication');
    }

    // Rate limiting
    if (isRateLimited(user.id)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        }
      );
    }

    // Enhanced admin role verification
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      // Log unauthorized access attempt
      await supabaseAdmin
        .from('security_audit_log')
        .insert({
          action: 'unauthorized_admin_access_attempt',
          user_id: user.id,
          details: { 
            endpoint: '/save-openai-key',
            user_email: user.email 
          },
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown',
        });

      throw new Error('Admin access required');
    }

    // Enhanced input validation
    const body = await req.json();
    const { key, model } = body;

    if (!key || typeof key !== 'string') {
      throw new Error('API key is required and must be a string');
    }

    // Validate OpenAI API key format
    if (!key.startsWith('sk-') || key.length < 20) {
      throw new Error('Invalid OpenAI API key format');
    }

    // Additional security: check for suspicious patterns
    if (key.includes(' ') || key.includes('\n') || key.includes('\t')) {
      throw new Error('Invalid API key format - contains whitespace');
    }

    // Store the key securely in site_settings (for AI functions)
    const { error: upsertError } = await supabaseAdmin
      .from('site_settings')
      .upsert({
        key: 'openai_api_key',
        value: {
          api_key: key,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        },
        description: 'OpenAI API Key for AI features'
      });

    if (upsertError) {
      console.error('Database error:', upsertError);
      throw new Error(`Failed to save API key: ${upsertError.message}`);
    }

    // Store the selected model separately
    const { error: modelError } = await supabaseAdmin
      .from('site_settings')
      .upsert({
        key: 'openai_model',
        value: {
          model: model || 'gpt-4.1-mini',
          updated_at: new Date().toISOString(),
          updated_by: user.id
        },
        description: 'Selected OpenAI Model for AI features'
      });

    if (modelError) {
      console.error('Model save error:', modelError);
      throw new Error(`Failed to save model preference: ${modelError.message}`);
    }

    // Log the API key update for security audit
    await supabaseAdmin
      .from('security_audit_log')
      .insert({
        action: 'openai_api_key_updated',
        user_id: user.id,
        details: { 
          updated_by_email: user.email,
          key_preview: `${key.substring(0, 7)}...${key.substring(key.length - 4)}`,
          model: model || 'gpt-4.1-mini'
        },
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OpenAI API key and model saved successfully',
        model: model || 'gpt-4.1-mini',
        updated_at: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY"
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Save OpenAI key error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff"
        },
        status: error instanceof Error && error.message.includes('Rate limit') ? 429 : 500,
      }
    );
  }
});
